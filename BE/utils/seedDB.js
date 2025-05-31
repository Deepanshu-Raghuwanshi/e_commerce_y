const Product = require("../models/Product");

// Hardcoded product data with unique images for each product
const hardcodedProducts = [
  // Smartphones (5 products)
  {
    name: "Apple iPhone 15 Pro",
    price: 999,
    category: "Smartphones",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    description:
      "Latest iPhone with advanced camera system, A17 Pro chip, and titanium design. Perfect for photography and professional use.",
    quantity: 50,
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    price: 1199,
    category: "Smartphones",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    description:
      "Flagship Android phone with S Pen, 200MP camera, and AI-powered features for productivity and creativity.",
    quantity: 45,
  },
  {
    name: "Google Pixel 8",
    price: 699,
    category: "Smartphones",
    variant: "Standard",
    image: "https://i.ytimg.com/vi/otomCbnwsv0/maxresdefault.jpg",
    description:
      "Pure Android experience with exceptional computational photography and Google AI integration.",
    quantity: 60,
  },
  {
    name: "OnePlus 12",
    price: 799,
    category: "Smartphones",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop",
    description:
      "Fast charging flagship with Snapdragon 8 Gen 3, smooth 120Hz display, and OxygenOS.",
    quantity: 35,
  },
  {
    name: "Xiaomi 14 Pro",
    price: 649,
    category: "Smartphones",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=300&fit=crop",
    description:
      "High-performance smartphone with Leica camera system and premium build quality at competitive price.",
    quantity: 40,
  },

  // Laptops (5 products)
  {
    name: "Apple MacBook Pro 16",
    price: 2499,
    category: "Laptops",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    description:
      "Professional laptop with M3 Max chip, stunning Liquid Retina XDR display, and all-day battery life.",
    quantity: 25,
  },
  {
    name: "Dell XPS 13 Plus",
    price: 1299,
    category: "Laptops",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
    description:
      "Ultra-portable laptop with InfinityEdge display, premium materials, and exceptional performance.",
    quantity: 30,
  },
  {
    name: "Lenovo ThinkPad X1 Carbon",
    price: 1599,
    category: "Laptops",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    description:
      "Business laptop with legendary ThinkPad reliability, security features, and lightweight carbon fiber design.",
    quantity: 20,
  },
  {
    name: "HP Spectre x360",
    price: 1199,
    category: "Laptops",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop",
    description:
      "Convertible laptop with 360-degree hinge, OLED display option, and premium gem-cut design.",
    quantity: 28,
  },
  {
    name: "Microsoft Surface Laptop 5",
    price: 999,
    category: "Laptops",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop",
    description:
      "Elegant laptop with Alcantara keyboard, vibrant PixelSense touchscreen, and Windows 11 integration.",
    quantity: 35,
  },

  // Headphones (5 products)
  {
    name: "Sony WH-1000XM5",
    price: 399,
    category: "Headphones",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    description:
      "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.",
    quantity: 75,
  },
  {
    name: "Apple AirPods Pro 2",
    price: 249,
    category: "Headphones",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop",
    description:
      "Wireless earbuds with adaptive transparency, spatial audio, and personalized listening experience.",
    quantity: 100,
  },
  {
    name: "Bose QuietComfort 45",
    price: 329,
    category: "Headphones",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
    description:
      "Comfortable over-ear headphones with world-class noise cancellation and balanced sound signature.",
    quantity: 60,
  },
  {
    name: "Sennheiser HD 660S2",
    price: 599,
    category: "Headphones",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=400&h=300&fit=crop",
    description:
      "Open-back audiophile headphones with natural sound reproduction and premium build quality.",
    quantity: 25,
  },
  {
    name: "JBL Live 660NC",
    price: 199,
    category: "Headphones",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop",
    description:
      "Wireless headphones with adaptive noise cancelling, JBL signature sound, and voice assistant support.",
    quantity: 80,
  },

  // Cameras (5 products)
  {
    name: "Canon EOS R5",
    price: 3899,
    category: "Cameras",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    description:
      "Professional mirrorless camera with 45MP sensor, 8K video recording, and advanced autofocus system.",
    quantity: 15,
  },
  {
    name: "Sony Alpha A7 IV",
    price: 2499,
    category: "Cameras",
    variant: "Premium",
    image:
      "https://i.ytimg.com/vi/TaGmsLVeEBk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCcfJvIF0vfUNoWPHeHP_OavRFODA",
    description:
      "Full-frame mirrorless camera with 33MP sensor, 4K video, and exceptional low-light performance.",
    quantity: 20,
  },
  {
    name: "Nikon Z9",
    price: 5499,
    category: "Cameras",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&h=300&fit=crop",
    description:
      "Flagship mirrorless camera with 45.7MP stacked sensor, 8K video, and professional-grade features.",
    quantity: 10,
  },
  {
    name: "Fujifilm X-T5",
    price: 1699,
    category: "Cameras",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1606986628253-4e6e4c0b4c3d?w=400&h=300&fit=crop",
    description:
      "APS-C mirrorless camera with 40MP sensor, film simulation modes, and classic design aesthetics.",
    quantity: 25,
  },
  {
    name: "Panasonic Lumix GH6",
    price: 2199,
    category: "Cameras",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    description:
      "Micro Four Thirds camera optimized for video with 5.7K recording and advanced stabilization.",
    quantity: 18,
  },

  // Watches (5 products)
  {
    name: "Apple Watch Series 9",
    price: 399,
    category: "Watches",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop",
    description:
      "Advanced smartwatch with health monitoring, fitness tracking, and seamless iPhone integration.",
    quantity: 85,
  },
  {
    name: "Rolex Submariner",
    price: 8950,
    category: "Watches",
    variant: "Deluxe",
    image:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=300&fit=crop",
    description:
      "Iconic luxury dive watch with Swiss automatic movement, waterproof design, and timeless elegance.",
    quantity: 5,
  },
  {
    name: "Omega Speedmaster",
    price: 5200,
    category: "Watches",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=300&fit=crop",
    description:
      "Legendary chronograph watch worn on the moon, featuring manual-wind movement and racing heritage.",
    quantity: 8,
  },
  {
    name: "Casio G-Shock GA-2100",
    price: 99,
    category: "Watches",
    variant: "Standard",
    image:
      "https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/G/GA/GA2/ga-2100gb-1a/assets/GA-2100GB-1A.png.transform/main-visual-sp/image.png",
    description:
      "Rugged digital watch with shock resistance, water resistance, and modern octagonal design.",
    quantity: 120,
  },
  {
    name: "Samsung Galaxy Watch 6",
    price: 329,
    category: "Watches",
    variant: "Premium",
    image:
      "https://images.samsung.com/in/galaxy-watch6/feature/galaxy-watch6-progress-startframe-mo.jpg",
    description:
      "Android smartwatch with comprehensive health tracking, GPS, and rotating bezel navigation.",
    quantity: 70,
  },

  // Men's Clothing (5 products)
  {
    name: "Nike Dri-FIT T-Shirt",
    price: 29,
    category: "Men's Clothing",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop",
    description:
      "Moisture-wicking athletic t-shirt with comfortable fit and breathable fabric for active lifestyle.",
    quantity: 200,
  },
  {
    name: "Levi's 511 Slim Jeans",
    price: 79,
    category: "Men's Clothing",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
    description:
      "Classic slim-fit jeans with authentic denim construction and timeless style for everyday wear.",
    quantity: 150,
  },
  {
    name: "Ralph Lauren Polo Shirt",
    price: 89,
    category: "Men's Clothing",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop",
    description:
      "Premium cotton polo shirt with classic fit, embroidered logo, and sophisticated casual style.",
    quantity: 100,
  },
  {
    name: "Dockers Alpha Khaki Chinos",
    price: 59,
    category: "Men's Clothing",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=300&fit=crop",
    description:
      "Versatile chino pants with modern tapered fit, wrinkle resistance, and smart-casual appeal.",
    quantity: 120,
  },
  {
    name: "Champion Powerblend Hoodie",
    price: 45,
    category: "Men's Clothing",
    variant: "Standard",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwF2zQ7JByAZMGXsvS06Wd68QqFMeWzRA_yA&s",
    description:
      "Comfortable fleece hoodie with reduced pilling, kangaroo pocket, and classic athletic styling.",
    quantity: 180,
  },

  // Women's Clothing (5 products)
  {
    name: "Zara Floral Summer Dress",
    price: 49,
    category: "Women's Clothing",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
    description:
      "Elegant floral dress with flowing silhouette, perfect for summer occasions and casual elegance.",
    quantity: 90,
  },
  {
    name: "H&M Silk Blouse",
    price: 39,
    category: "Women's Clothing",
    variant: "Premium",
    image:
      "https://image.hm.com/assets/hm/38/e2/38e2e8c8818cc64f6244ac79c2e59f2faca49a6c.jpg?imwidth=1260",
    description:
      "Luxurious silk blouse with professional styling, perfect for office wear and special occasions.",
    quantity: 75,
  },
  {
    name: "Levi's 721 High Rise Skinny Jeans",
    price: 89,
    category: "Women's Clothing",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=300&fit=crop",
    description:
      "Flattering high-rise skinny jeans with stretch denim and modern fit for all-day comfort.",
    quantity: 110,
  },
  {
    name: "Uniqlo Cashmere Cardigan",
    price: 99,
    category: "Women's Clothing",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop",
    description:
      "Soft cashmere cardigan with elegant drape, perfect layering piece for sophisticated style.",
    quantity: 60,
  },
  {
    name: "Free People Maxi Dress",
    price: 128,
    category: "Women's Clothing",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop",
    description:
      "Bohemian-inspired maxi dress with flowing fabric and artistic prints for free-spirited fashion.",
    quantity: 45,
  },

  // Shoes (5 products)
  {
    name: "Nike Air Max 270",
    price: 150,
    category: "Shoes",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    description:
      "Lifestyle sneakers with large Air unit, comfortable cushioning, and modern athletic design.",
    quantity: 95,
  },
  {
    name: "Adidas Stan Smith",
    price: 80,
    category: "Shoes",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
    description:
      "Classic white leather sneakers with minimalist design and timeless tennis-inspired style.",
    quantity: 130,
  },
  {
    name: "Cole Haan Oxford Dress Shoes",
    price: 200,
    category: "Shoes",
    variant: "Premium",
    image:
      "https://cdn17.nnnow.com/web-images/large/styles/XK32GHRI1GX/1599557496172/2.jpg",
    description:
      "Elegant leather dress shoes with Grand.OS technology for comfort and professional appearance.",
    quantity: 50,
  },
  {
    name: "Timberland 6-Inch Boots",
    price: 190,
    category: "Shoes",
    variant: "Premium",
    image:
      "https://www.stuartslondon.com/blog/wp-content/uploads/2023/12/Blog-Banner-2023-12-08T104956.681.jpg",
    description:
      "Durable waterproof boots with premium leather construction and iconic yellow boot styling.",
    quantity: 70,
  },
  {
    name: "Birkenstock Arizona Sandals",
    price: 110,
    category: "Shoes",
    variant: "Standard",
    image:
      "https://www.birkenstock.in/cdn/shop/files/1028280_sole.jpg?v=1720541987",
    description:
      "Comfortable cork footbed sandals with adjustable straps and ergonomic support for all-day wear.",
    quantity: 85,
  },

  // Bags (5 products)
  {
    name: "Coach Leather Handbag",
    price: 350,
    category: "Bags",
    variant: "Premium",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
    description:
      "Luxury leather handbag with signature Coach craftsmanship and timeless elegant design.",
    quantity: 40,
  },
  {
    name: "Herschel Little America Backpack",
    price: 100,
    category: "Bags",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    description:
      "Vintage-inspired backpack with laptop compartment and signature striped lining for daily use.",
    quantity: 120,
  },
  {
    name: "Michael Kors Tote Bag",
    price: 198,
    category: "Bags",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop",
    description:
      "Spacious tote bag with saffiano leather finish and gold-tone hardware for professional style.",
    quantity: 65,
  },
  {
    name: "Kate Spade Crossbody Bag",
    price: 179,
    category: "Bags",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=300&fit=crop",
    description:
      "Compact crossbody bag with playful design and practical organization for hands-free convenience.",
    quantity: 80,
  },
  {
    name: "Samsonite Travel Bag",
    price: 149,
    category: "Bags",
    variant: "Standard",
    image:
      "https://vesselgolf.com/cdn/shop/files/Memorial-Mobile_1.png?v=1747859081&width=1300",
    description:
      "Durable travel bag with multiple compartments, wheels, and expandable design for extended trips.",
    quantity: 55,
  },

  // Home Decor (5 products)
  {
    name: "IKEA Framed Wall Art",
    price: 25,
    category: "Home Decor",
    variant: "Basic",
    image:
      "https://www.ikea.com/gb/en/range-categorisation/images/canvas-art-ready-to-hang-art-10788.jpeg",
    description:
      "Modern abstract wall art with sleek frame, perfect for adding contemporary style to any room.",
    quantity: 150,
  },
  {
    name: "Philips LED Table Lamp",
    price: 89,
    category: "Home Decor",
    variant: "Standard",
    image: "https://m.media-amazon.com/images/I/41qo53WCkqL.jpg",
    description:
      "Energy-efficient LED table lamp with adjustable brightness and modern minimalist design.",
    quantity: 100,
  },
  {
    name: "West Elm Throw Pillow",
    price: 39,
    category: "Home Decor",
    variant: "Standard",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQeZ7FehUvlxDpEUhGl-feaMKFoqSDIas-Xg&s",
    description:
      "Decorative throw pillow with premium fabric and contemporary patterns for sofa styling.",
    quantity: 200,
  },
  {
    name: "CB2 Ceramic Vase",
    price: 49,
    category: "Home Decor",
    variant: "Premium",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSc1kt0KvKSADWRV2E8fVP0OVM0AIDdjIeKQ&s",
    description:
      "Handcrafted ceramic vase with unique glaze finish, perfect for fresh flowers or standalone decor.",
    quantity: 75,
  },
  {
    name: "Target Picture Frame Set",
    price: 19,
    category: "Home Decor",
    variant: "Basic",
    image:
      "https://i.etsystatic.com/21897860/r/il/819316/6268387797/il_570xN.6268387797_9ei9.jpg",
    description:
      "Set of coordinating picture frames in various sizes for creating personalized photo displays.",
    quantity: 180,
  },

  // Kitchen Appliances (5 products)
  {
    name: "Keurig K-Elite Coffee Maker",
    price: 169,
    category: "Kitchen Appliances",
    variant: "Premium",
    image:
      "https://m.media-amazon.com/images/I/71zUY9qXunL._AC_UF894,1000_QL80_.jpg",
    description:
      "Single-serve coffee maker with multiple brew sizes and strong brew option for perfect coffee.",
    quantity: 90,
  },
  {
    name: "Vitamix Professional Blender",
    price: 449,
    category: "Kitchen Appliances",
    variant: "Pro",
    image: "https://u-mercari-images.mercdn.net/photos/m78635799605_1.jpg",
    description:
      "High-performance blender with variable speed control for smoothies, soups, and food preparation.",
    quantity: 45,
  },
  {
    name: "Ninja Foodi Air Fryer",
    price: 199,
    category: "Kitchen Appliances",
    variant: "Premium",
    image:
      "https://m.media-amazon.com/images/I/61MyGX2pKcL._AC_UF894,1000_QL80_.jpg",
    description:
      "Multi-functional air fryer with pressure cooking capabilities for healthy and fast meal preparation.",
    quantity: 70,
  },
  {
    name: "Panasonic Microwave Oven",
    price: 129,
    category: "Kitchen Appliances",
    variant: "Standard",
    image:
      "https://m.media-amazon.com/images/S/aplus-media-library-service-media/5a565b42-f978-470f-b30e-c162f04e40e5.__CR0,0,600,450_PT0_SX600_V1___.png",
    description:
      "Countertop microwave with inverter technology and sensor cooking for even heating results.",
    quantity: 85,
  },
  {
    name: "Breville Smart Toaster",
    price: 249,
    category: "Kitchen Appliances",
    variant: "Premium",
    image: "https://m.media-amazon.com/images/I/71RJqDY7d6L.jpg",
    description:
      "Intelligent toaster with motorized lift and lowering, perfect toast every time with smart features.",
    quantity: 60,
  },

  // Gaming (5 products)
  {
    name: "Sony DualSense Controller",
    price: 69,
    category: "Gaming",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop",
    description:
      "Next-gen gaming controller with haptic feedback and adaptive triggers for immersive gameplay.",
    quantity: 150,
  },
  {
    name: "SteelSeries Arctis 7P Headset",
    price: 149,
    category: "Gaming",
    variant: "Premium",
    image:
      "https://assets2.razerzone.com/images/pnx.assets/eacc83c0643ed2da8c9e98968f8aa215/headset-landingpg-500x500-barracuda-x-chroma.webp",
    description:
      "Wireless gaming headset with lossless audio, comfortable design, and long battery life.",
    quantity: 80,
  },
  {
    name: "Logitech G Pro X Mouse",
    price: 129,
    category: "Gaming",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop",
    description:
      "Professional gaming mouse with HERO sensor, lightweight design, and customizable buttons.",
    quantity: 100,
  },
  {
    name: "Razer BlackWidow V4 Keyboard",
    price: 179,
    category: "Gaming",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
    description:
      "Mechanical gaming keyboard with tactile switches, RGB lighting, and programmable macros.",
    quantity: 70,
  },
  {
    name: "Secretlab Titan Evo Gaming Chair",
    price: 519,
    category: "Gaming",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop",
    description:
      "Ergonomic gaming chair with premium materials, adjustable features, and long-session comfort.",
    quantity: 25,
  },

  // Books (5 products)
  {
    name: "The Seven Husbands of Evelyn Hugo",
    price: 16,
    category: "Books",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    description:
      "Captivating fiction novel about love, ambition, and the price of fame in Hollywood's golden age.",
    quantity: 200,
  },
  {
    name: "Atomic Habits by James Clear",
    price: 18,
    category: "Books",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
    description:
      "Transformative self-help book about building good habits and breaking bad ones for lasting change.",
    quantity: 180,
  },
  {
    name: "Salt, Fat, Acid, Heat Cookbook",
    price: 35,
    category: "Books",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    description:
      "Award-winning cookbook teaching fundamental cooking techniques with beautiful illustrations.",
    quantity: 120,
  },
  {
    name: "Steve Jobs Biography",
    price: 22,
    category: "Books",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    description:
      "Comprehensive biography of Apple's co-founder, revealing insights into innovation and leadership.",
    quantity: 150,
  },
  {
    name: "Clean Code Technical Manual",
    price: 42,
    category: "Books",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop",
    description:
      "Essential programming guide for writing maintainable, readable, and efficient code.",
    quantity: 90,
  },

  // Sports Equipment (5 products)
  {
    name: "Manduka Pro Yoga Mat",
    price: 120,
    category: "Sports Equipment",
    variant: "Premium",
    image:
      "https://www.manduka.com/cdn/shop/files/PRO_video_image.jpg?v=1707371875&width=1500",
    description:
      "Professional-grade yoga mat with superior grip, cushioning, and lifetime guarantee.",
    quantity: 85,
  },
  {
    name: "Bowflex Adjustable Dumbbells",
    price: 349,
    category: "Sports Equipment",
    variant: "Pro",
    image:
      "https://m.media-amazon.com/images/I/61jau6tusOL._AC_UF894,1000_QL80_.jpg",
    description:
      "Space-saving adjustable dumbbells replacing multiple weights with quick weight selection.",
    quantity: 40,
  },
  {
    name: "Wilson Pro Staff Tennis Racket",
    price: 199,
    category: "Sports Equipment",
    variant: "Pro",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxkLgnenjhGqiVpOdB95wfb0u4mvf15efe0g&s",
    description:
      "Professional tennis racket with precision control and power for competitive play.",
    quantity: 60,
  },
  {
    name: "Spalding NBA Basketball",
    price: 29,
    category: "Sports Equipment",
    variant: "Standard",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT--BEPzRNsWS640MEKRAhJZLYGMBFRkt4SDA&s",
    description:
      "Official size basketball with composite leather cover for indoor and outdoor play.",
    quantity: 120,
  },
  {
    name: "TRX Suspension Trainer",
    price: 195,
    category: "Sports Equipment",
    variant: "Premium",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThPnw-VBX2F_NaonNDyV5w-syUeE_YgRyp8g&s",
    description:
      "Versatile suspension training system for full-body workouts anywhere with bodyweight resistance.",
    quantity: 70,
  },

  // Beauty Products (5 products)
  {
    name: "Olay Regenerist Face Cream",
    price: 28,
    category: "Beauty Products",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    description:
      "Anti-aging face cream with amino-peptides and niacinamide for smoother, firmer skin.",
    quantity: 150,
  },
  {
    name: "MAC Ruby Woo Lipstick",
    price: 19,
    category: "Beauty Products",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop",
    description:
      "Iconic matte red lipstick with rich color payoff and long-lasting formula.",
    quantity: 200,
  },
  {
    name: "Fenty Beauty Foundation",
    price: 36,
    category: "Beauty Products",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop",
    description:
      "Inclusive foundation with 50 shades, medium to full coverage, and natural finish.",
    quantity: 120,
  },
  {
    name: "Maybelline Great Lash Mascara",
    price: 7,
    category: "Beauty Products",
    variant: "Basic",
    image:
      "https://images.unsplash.com/photo-1631214540242-3cd8c4b6b9e8?w=400&h=300&fit=crop",
    description:
      "Classic mascara for lengthening and separating lashes with buildable formula.",
    quantity: 300,
  },
  {
    name: "Chanel No. 5 Perfume",
    price: 132,
    category: "Beauty Products",
    variant: "Deluxe",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
    description:
      "Timeless luxury fragrance with floral aldehydic scent and iconic bottle design.",
    quantity: 50,
  },

  // Jewelry (5 products)
  {
    name: "Tiffany & Co. Diamond Ring",
    price: 2500,
    category: "Jewelry",
    variant: "Deluxe",
    image: "https://4.imimg.com/data4/QW/YU/FUSIONI-3520335/prod-image.jpg",
    description:
      "Elegant solitaire diamond ring with platinum setting and exceptional cut quality.",
    quantity: 15,
  },
  {
    name: "Pandora Gold Necklace",
    price: 89,
    category: "Jewelry",
    variant: "Premium",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop",
    description:
      "Delicate gold chain necklace with signature Pandora charm compatibility and craftsmanship.",
    quantity: 80,
  },
  {
    name: "David Yurman Silver Bracelet",
    price: 395,
    category: "Jewelry",
    variant: "Premium",
    image:
      "https://silveradda.com/wp-content/uploads/2023/03/Pure-Silver-Bracelet-For-Men-_-925-Silver-Heavy-Look-Bracelet-For-Men.jpg",
    description:
      "Signature cable bracelet in sterling silver with distinctive twisted design and quality.",
    quantity: 45,
  },
  {
    name: "Mikimoto Pearl Earrings",
    price: 650,
    category: "Jewelry",
    variant: "Deluxe",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
    description:
      "Classic cultured pearl stud earrings with lustrous finish and timeless elegance.",
    quantity: 35,
  },
  {
    name: "Fossil Leather Watch",
    price: 125,
    category: "Jewelry",
    variant: "Standard",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop",
    description:
      "Vintage-inspired watch with leather strap, analog display, and classic American design.",
    quantity: 90,
  },

  // Furniture (5 products)
  {
    name: "Herman Miller Aeron Chair",
    price: 1395,
    category: "Furniture",
    variant: "Pro",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    description:
      "Ergonomic office chair with breathable mesh, adjustable features, and award-winning design.",
    quantity: 30,
  },
  {
    name: "West Elm Mid-Century Coffee Table",
    price: 399,
    category: "Furniture",
    variant: "Premium",
    image:
      "https://images.woodenstreet.de/image/cache/data/coffee-table/elevate-sheesham-wood-glass-top-coffee-table-with-storage-walnut-finish/walnut-finish/new-logo/1-810x702.jpg",
    description:
      "Walnut wood coffee table with tapered legs and mid-century modern aesthetic.",
    quantity: 50,
  },
  {
    name: "IKEA Billy Bookshelf",
    price: 60,
    category: "Furniture",
    variant: "Basic",
    image: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg",
    description:
      "Versatile bookshelf with adjustable shelves and clean Scandinavian design for any room.",
    quantity: 100,
  },
  {
    name: "CB2 Standing Desk",
    price: 699,
    category: "Furniture",
    variant: "Premium",
    image:
      "https://ergologic.in/wp-content/uploads/2024/05/Height-Adjustable-Table-%E2%80%93-Electric-Single-Motor-Standing-Desk-Work-From-Home-Series-premium-quality-black-color-frame-black-table-top-mdf-solid-wood-ergologic-with-rounded-edges.jpg",
    description:
      "Height-adjustable standing desk with electric motor and modern minimalist design.",
    quantity: 40,
  },
  {
    name: "Article Sven Sofa",
    price: 1299,
    category: "Furniture",
    variant: "Premium",
    image:
      "https://shop.gkwretail.com/cdn/shop/products/7SeaterSofaSet100100SectionalSofaCouchLShapeSofa.jpg?v=1633609252&width=533",
    description:
      "Mid-century modern sofa with tufted cushions, solid wood frame, and premium upholstery.",
    quantity: 25,
  },

  // Toys (5 products)
  {
    name: "LEGO Creator Expert Set",
    price: 179,
    category: "Toys",
    variant: "Premium",
    image:
      "https://lh5.googleusercontent.com/proxy/zEsNs5qwncaCaWNk1zv7pvCocg4SxlLsiOgfGwBnd-44E9hfGL-_9mH985PcgWUlfcV5SIeK-FRo_ix27hqixuJBZ9pitjOEE3cJzFghWg6ViFBJ-waAYwCTNzWjXTD0rppucNKCYDgJ1CrLyfHsY3otbByAF-eMs0c",
    description:
      "Advanced building set with detailed instructions for creating complex architectural models.",
    quantity: 60,
  },
  {
    name: "Marvel Spider-Man Action Figure",
    price: 24,
    category: "Toys",
    variant: "Standard",
    image:
      "https://m.media-amazon.com/images/I/81zgJNTFA+L._AC_UF1000,1000_QL80_.jpg",
    description:
      "Highly detailed action figure with multiple points of articulation and authentic costume design.",
    quantity: 150,
  },
  {
    name: "Ravensburger 1000-Piece Puzzle",
    price: 18,
    category: "Toys",
    variant: "Standard",
    image:
      "https://m.media-amazon.com/images/I/71caD9OUG4L._AC_UF1000,1000_QL80_.jpg",
    description:
      "High-quality jigsaw puzzle with precision-cut pieces and beautiful artwork for hours of entertainment.",
    quantity: 120,
  },
  {
    name: "Monopoly Classic Board Game",
    price: 19,
    category: "Toys",
    variant: "Standard",
    image:
      "https://media.gettyimages.com/id/458416383/photo/classic-monopoly-game-on-the-floor-midgame.jpg?s=612x612&w=gi&k=20&c=lueAoHhNCt4ca0c22D0hfOA7a4z8nojSi4sjoNHQNLM=",
    description:
      "Timeless family board game of property trading and strategic gameplay for all ages.",
    quantity: 200,
  },
  {
    name: "Jellycat Bashful Bunny",
    price: 22,
    category: "Toys",
    variant: "Standard",
    image: "https://m.media-amazon.com/images/I/61uQcgBEX8L.jpg",
    description:
      "Soft plush bunny with velvety fur, perfect for cuddling and imaginative play.",
    quantity: 180,
  },

  // Health & Fitness (5 products)
  {
    name: "Optimum Nutrition Whey Protein",
    price: 58,
    category: "Health & Fitness",
    variant: "Standard",
    image:
      "https://m.media-amazon.com/images/I/71f+UBXh2vL._AC_UF1000,1000_QL80_.jpg",
    description:
      "High-quality whey protein powder with 24g protein per serving for muscle building and recovery.",
    quantity: 100,
  },
  {
    name: "Fitbit Charge 5 Tracker",
    price: 179,
    category: "Health & Fitness",
    variant: "Premium",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyCnCm6kvNcrapJ3Yuk38U_tU0n1EyyzkwKg&s",
    description:
      "Advanced fitness tracker with GPS, heart rate monitoring, and stress management features.",
    quantity: 85,
  },
  {
    name: "Gaiam Yoga Block Set",
    price: 19,
    category: "Health & Fitness",
    variant: "Basic",
    image:
      "https://thumbs.dreamstime.com/b/blue-yoga-set-mat-blocks-strap-tile-background-69513138.jpg",
    description:
      "Supportive foam yoga blocks for proper alignment and deeper poses in yoga practice.",
    quantity: 150,
  },
  {
    name: "Theraband Resistance Bands",
    price: 25,
    category: "Health & Fitness",
    variant: "Standard",
    image: "https://aarogyamandir.in/wp-content/uploads/2024/05/theraband.jpg",
    description:
      "Professional resistance bands set with multiple resistance levels for strength training.",
    quantity: 120,
  },
  {
    name: "Hydro Flask Water Bottle",
    price: 44,
    category: "Health & Fitness",
    variant: "Premium",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThN_vvqKS7JkRfNIJPPyHjhzB0-4YVcCoqcQ&s",
    description:
      "Insulated stainless steel water bottle keeping drinks cold for 24 hours or hot for 12 hours.",
    quantity: 200,
  },

  // Automotive (5 products)
  {
    name: "iOttie Car Phone Mount",
    price: 29,
    category: "Automotive",
    variant: "Standard",
    image:
      "https://stingeraustralia.com.au/wp-content/uploads/2024/02/optimized-iottie.com_velox_flush_lifestyle_21.jpg",
    description:
      "Universal car phone mount with one-touch release and 360-degree rotation for safe navigation.",
    quantity: 150,
  },
  {
    name: "Garmin Dash Cam 67W",
    price: 199,
    category: "Automotive",
    variant: "Premium",
    image:
      "https://cdn.thewirecutter.com/wp-content/media/2025/01/BEST-CAR-PHONE-MOUNTS-2048px-6035.jpg?auto=webp&quality=60&width=570",
    description:
      "Compact dash camera with 1440p recording, wide-angle lens, and voice control features.",
    quantity: 70,
  },
  {
    name: "Anker PowerDrive Car Charger",
    price: 19,
    category: "Automotive",
    variant: "Standard",
    image:
      "https://ringke.co.in/cdn/shop/files/71JUGYrAihL._SL1500.jpg?v=1703150347",
    description:
      "Fast-charging car adapter with dual USB ports and PowerIQ technology for device optimization.",
    quantity: 200,
  },
  {
    name: "FH Group Seat Covers",
    price: 45,
    category: "Automotive",
    variant: "Standard",
    image:
      "https://carhatke.com/image/cache/catalog/seat/car-seat-cover-coffee-and-black-1500x1500.jpg",
    description:
      "Universal fit seat covers with water-resistant fabric and easy installation for interior protection.",
    quantity: 90,
  },
  {
    name: "Chemical Guys Air Freshener",
    price: 8,
    category: "Automotive",
    variant: "Basic",
    image: "https://m.media-amazon.com/images/I/71ybBtjT84L.jpg",
    description:
      "Premium car air freshener with long-lasting scent and easy hanging design for fresh interior.",
    quantity: 300,
  },
];

/**
 * Seeds the database with initial products if the products collection is empty
 */
const seedIfEmpty = async () => {
  try {
    // Check if products collection is empty
    const count = await Product.countDocuments();

    if (count === 0) {
      console.log("Products collection is empty. Seeding database...");

      // Insert hardcoded products
      await Product.insertMany(hardcodedProducts);
      console.log(
        `Database seeded successfully with ${hardcodedProducts.length} e-commerce products`
      );
    } else {
      console.log(
        `Database already contains ${count} products. Skipping seed.`
      );
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

/**
 * Resets the database by deleting all collections and re-seeding products
 */
const resetDatabase = async () => {
  try {
    console.log("Resetting database...");

    // Import all models
    const User = require("../models/User");
    const Cart = require("../models/Cart");
    const Order = require("../models/Order");

    // Delete all documents from all collections
    await User.deleteMany({});
    console.log("All users deleted");

    await Cart.deleteMany({});
    console.log("All carts deleted");

    await Order.deleteMany({});
    console.log("All orders deleted");

    await Product.deleteMany({});
    console.log("All products deleted");

    // Insert new hardcoded products
    await Product.insertMany(hardcodedProducts);
    console.log(
      `Database re-seeded successfully with ${hardcodedProducts.length} e-commerce products across 20 categories`
    );

    return {
      success: true,
      message: "Database reset and re-seeded successfully",
      productsCount: hardcodedProducts.length,
      categories: [...new Set(hardcodedProducts.map((p) => p.category))].length,
    };
  } catch (error) {
    console.error("Error resetting database:", error);
    return {
      success: false,
      message: "Database reset failed",
      error: error.message,
    };
  }
};

module.exports = {
  seedIfEmpty,
  resetDatabase,
  hardcodedProducts,
};
