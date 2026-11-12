import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing listings images and orthography in database...');

  // 1. Fix soap listing image
  const soapListings = await prisma.listing.findMany({
    where: {
      OR: [
        { title: { contains: 'sovun' } },
        { titleRu: { contains: 'мыло' } },
        { titleRu: { contains: 'Мыло' } }
      ]
    },
    include: { images: true }
  });

  const soapUrl = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
  for (const item of soapListings) {
    if (item.images.length > 0) {
      await prisma.listingImage.update({
        where: { id: item.images[0].id },
        data: { url: soapUrl, thumbUrl: soapUrl }
      });
    } else {
      await prisma.listingImage.create({
        data: { listingId: item.id, url: soapUrl, thumbUrl: soapUrl }
      });
    }
    console.log(`Updated soap image for listing: ${item.id}`);
  }

  // 2. Fix brick listing image
  const brickListings = await prisma.listing.findMany({
    where: {
      OR: [
        { title: { contains: 'g\'isht' } },
        { title: { contains: 'gʻisht' } },
        { titleRu: { contains: 'кирпич' } },
        { titleRu: { contains: 'Кирпич' } }
      ]
    },
    include: { images: true }
  });

  const brickUrl = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80';
  for (const item of brickListings) {
    if (item.images.length > 0) {
      await prisma.listingImage.update({
        where: { id: item.images[0].id },
        data: { url: brickUrl, thumbUrl: brickUrl }
      });
    } else {
      await prisma.listingImage.create({
        data: { listingId: item.id, url: brickUrl, thumbUrl: brickUrl }
      });
    }
    console.log(`Updated brick image for listing: ${item.id}`);
  }

  // 3. Fix all listings orthography (replacing ' with ʻ or ʼ)
  const allListings = await prisma.listing.findMany();
  for (const item of allListings) {
    let title = item.title;
    let desc = item.description || '';

    title = title
      .replace(/g'|g‘|g’|g`/g, 'gʻ')
      .replace(/G'|G‘|G’|G`/g, 'Gʻ')
      .replace(/o'|o‘|o’|o`/g, 'oʻ')
      .replace(/O'|O‘|O’|O`/g, 'Oʻ')
      .replace(/'|‘|’|`/g, 'ʼ');

    if (desc) {
      desc = desc
        .replace(/g'|g‘|g’|g`/g, 'gʻ')
        .replace(/G'|G‘|G’|G`/g, 'Gʻ')
        .replace(/o'|o‘|o’|o`/g, 'oʻ')
        .replace(/O'|O‘|O’|O`/g, 'Oʻ')
        .replace(/'|‘|’|`/g, 'ʼ');
    }

    if (title !== item.title || desc !== item.description) {
      await prisma.listing.update({
        where: { id: item.id },
        data: { title, description: desc }
      });
      console.log(`Normalized orthography: ${item.id} -> ${title}`);
    }
  }

  // 4. Ensure demo user has conversations with unread messages
  const demoUser = await prisma.user.findFirst({
    where: { login: 'demo' }
  });

  if (demoUser) {
    // Find contracts where demo is buyer
    const contracts = await prisma.contract.findMany({
      where: { buyerId: demoUser.id },
      include: { conversation: { include: { messages: true } }, seller: true }
    });

    for (const contract of contracts) {
      let conv = contract.conversation;
      if (!conv) {
        conv = await prisma.conversation.create({
          data: {
            contractId: contract.id,
            buyerId: demoUser.id,
            sellerId: contract.sellerId
          },
          include: { messages: true }
        });
        console.log(`Created conversation for contract ${contract.number}`);
      }

      // Check unread message from seller
      const unreadFromSeller = conv.messages.filter(m => m.senderId === contract.sellerId && !m.readAt);
      if (unreadFromSeller.length === 0) {
        await prisma.message.create({
          data: {
            conversationId: conv.id,
            senderId: contract.sellerId,
            text: 'Assalomu alaykum! Shartnoma boʻyicha yuk tayyorlab qoʻyildi, transport qachon keladi?',
            readAt: null
          }
        });
        console.log(`Added unread message in conversation for contract ${contract.number}`);
      }
    }
  }

  console.log('Database fix script completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
