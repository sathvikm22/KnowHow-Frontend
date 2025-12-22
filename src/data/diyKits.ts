export interface DIYKit {
  name: string;
  price: number;
  image: string | null;
  description: string;
}

export const diyKits: DIYKit[] = [
  { 
    name: "DIY Make Your Own Candle Kit", 
    price: 499, 
    image: null,
    description: "Create beautiful, aromatic candles with this complete kit. Includes wax, wicks, fragrance oils, and containers. Perfect for beginners and a great way to add a personal touch to your home decor."
  },
  { 
    name: "DIY Avengers Wall Hanger Kits", 
    price: 399, 
    image: null,
    description: "Showcase your love for Marvel superheroes with this wall hanger kit. Includes all materials needed to create stunning Avengers-themed wall decorations. Great for kids and Marvel fans!"
  },
  { 
    name: "DIY DC Super Hero Kits", 
    price: 399, 
    image: null,
    description: "Bring DC Comics heroes to life with this creative wall hanger kit. Perfect for decorating your room with Batman, Superman, Wonder Woman, and more. All materials included."
  },
  { 
    name: "DIY Crochet Keyring Kit", 
    price: 299, 
    image: null,
    description: "Learn the art of crochet while creating adorable keyrings. Kit includes yarn, crochet hooks, and step-by-step instructions. Make cute accessories for yourself or as gifts."
  },
  { 
    name: "Lippan Art Kit", 
    price: 499, 
    image: null,
    description: "Explore traditional Indian Lippan art with this comprehensive kit. Create beautiful mud mirror work designs. Includes clay, mirrors, and detailed instructions for authentic Lippan artwork."
  },
  { 
    name: "Mandala Art Kit", 
    price: 499, 
    image: null,
    description: "Create stunning mandala designs with this complete art kit. Includes fine-tip pens, compass, and templates. Perfect for stress relief and creating beautiful, intricate patterns."
  },
  { 
    name: "Paint Your Own Photo Frame", 
    price: 349, 
    image: null,
    description: "Personalize your memories with this paint-your-own photo frame kit. Includes wooden frame, paints, brushes, and decorative elements. Make a unique frame for your favorite photos."
  },
  { 
    name: "Paint By Numbers", 
    price: 299, 
    image: null,
    description: "Relax and create beautiful artwork with this paint-by-numbers kit. Includes pre-printed canvas, numbered paints, and brushes. Perfect for beginners and art enthusiasts alike."
  },
  { 
    name: "Diamond Painting Kit", 
    price: 399, 
    image: null,
    description: "Create sparkling artwork with diamond painting. Kit includes adhesive canvas, colorful resin diamonds, applicator tool, and tray. Create stunning, shimmering art pieces."
  },
  { 
    name: "Diamond Painting Clock Kit", 
    price: 499, 
    image: null,
    description: "Combine art and functionality with this diamond painting clock kit. Create a beautiful, sparkling clock for your wall. Includes clock mechanism, diamonds, and all materials."
  },
  { 
    name: "DIY Mason Jar Kit", 
    price: 499, 
    image: null,
    description: "Transform ordinary mason jars into beautiful decorative pieces. Kit includes jars, paints, brushes, and decorative materials. Perfect for home decor and gift-making."
  },
  { 
    name: "DIY Fridge Magnet with Bag Kit", 
    price: 399, 
    image: null,
    description: "Create custom fridge magnets and a matching bag. Kit includes magnet sheets, fabric, decorative elements, and instructions. Add personality to your kitchen and accessories."
  },
  { 
    name: "DIY Embroidery Kit", 
    price: 399, 
    image: null,
    description: "Learn the timeless art of embroidery. Kit includes fabric, embroidery threads, needles, hoop, and patterns. Create beautiful hand-stitched designs for clothing and home decor."
  },
  { 
    name: "DIY Pouch Embroidery Kit", 
    price: 399, 
    image: null,
    description: "Create a beautiful embroidered pouch with this complete kit. Includes pouch fabric, threads, needles, and embroidery patterns. Perfect for storing small items in style."
  },
  { 
    name: "DIY Tote Bag Embroidery Kit", 
    price: 399, 
    image: null,
    description: "Design your own embroidered tote bag. Kit includes canvas tote bag, embroidery threads, needles, and patterns. Create a unique, eco-friendly shopping bag."
  },
  { 
    name: "DIY Punch Needles Kit", 
    price: 499, 
    image: null,
    description: "Explore the art of punch needle embroidery. Kit includes punch needle tool, yarn, fabric, and patterns. Create textured, beautiful designs with this relaxing craft."
  },
  { 
    name: "DIY Origami Kit", 
    price: 199, 
    image: null,
    description: "Learn the ancient art of paper folding with this origami kit. Includes colorful origami paper, instruction book, and patterns. Create animals, flowers, and decorative items."
  },
  { 
    name: "DIY Clock Kit", 
    price: 799, 
    image: null,
    description: "Build and decorate your own functional clock. Kit includes clock mechanism, clock face, decorative materials, and instructions. Create a unique timepiece for your home."
  },
  { 
    name: "Animal Kingdom Kit", 
    price: 299, 
    image: null,
    description: "Create adorable animal-themed crafts with this kit. Includes materials to make various animal decorations and accessories. Perfect for kids and animal lovers."
  },
  { 
    name: "Wall Hanger Kits", 
    price: 299, 
    image: null,
    description: "Decorate your walls with beautiful handmade hangers. Kit includes materials to create multiple wall hanging designs. Add a bohemian touch to your living space."
  },
  { 
    name: "Mandala Coaster Kits", 
    price: 399, 
    image: null,
    description: "Create stunning mandala-patterned coasters for your home. Kit includes coaster blanks, paints, brushes, and mandala templates. Protect your furniture in style."
  },
  { 
    name: "dummy-razor", 
    price: 1, 
    image: null,
    description: "Dummy razor kit for testing purposes."
  }
];

// Helper function to get image path
export const getImagePath = (kit: DIYKit) => {
  if (kit.image) {
    return kit.image;
  }
  const imageName = kit.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `/lovable-uploads/diy-kits/${imageName}.jpg`;
};

