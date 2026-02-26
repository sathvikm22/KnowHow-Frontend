import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useEffect, useState } from "react"

const Testimonials = () => {
  const [api, setApi] = useState<any>()

  const galleryImages = [
    { src: "/lovable-uploads/gallery-1.jpeg", alt: "Gallery image 1" },
    { src: "/lovable-uploads/gallery-2.jpeg", alt: "Gallery image 2" },
    { src: "/lovable-uploads/gallery-3.jpeg", alt: "Gallery image 3" },
    { src: "/lovable-uploads/gallery-4.jpeg", alt: "Gallery image 4" },
    { src: "/lovable-uploads/gallery-5.jpeg", alt: "Gallery image 5" },
    { src: "/lovable-uploads/gallery-6.jpeg", alt: "Gallery image 6" },
    { src: "/lovable-uploads/gallery-7.jpeg", alt: "Gallery image 7" },
    { src: "/lovable-uploads/gallery-8.jpeg", alt: "Gallery image 8" },
    { src: "/lovable-uploads/gallery-9.jpeg", alt: "Gallery image 9" },
    { src: "/lovable-uploads/gallery-10.jpeg", alt: "Gallery image 10" },
    { src: "/lovable-uploads/gallery-11.jpeg", alt: "Gallery image 11" },
    { src: "/lovable-uploads/gallery-12.jpeg", alt: "Gallery image 12" },
    { src: "/lovable-uploads/gallery-13.jpeg", alt: "Gallery image 13" },
    { src: "/lovable-uploads/gallery-14.jpeg", alt: "Gallery image 14" },
    { src: "/lovable-uploads/gallery-15.jpeg", alt: "Gallery image 15" },
  ];

  useEffect(() => {
    if (!api) {
      return
    }

    // Much smoother auto-scroll every 2.5 seconds
    const interval = setInterval(() => {
      api.scrollNext()
    }, 2500)

    return () => clearInterval(interval)
  }, [api])

  return (
    <section id="testimonials" className="py-20" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-wide" style={{ fontFamily: "'Bowlby One SC', sans-serif", letterSpacing: '0.02em', color: '#191919' }}>
            Our Studio Gallery
          </h2>
          <div className="w-20 h-1 bg-black mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a glimpse into our vibrant creative spaces where artistry comes to life
          </p>
        </div>

        {/* White Rectangle Container */}
        <div className="bg-white rounded-3xl p-2 mx-auto max-w-7xl shadow-2xl border-2 border-black relative">
          <div className="relative overflow-hidden rounded-2xl p-2 sm:p-4 md:p-6 lg:p-8 z-10" style={{ backgroundColor: '#B3ECEC' }}>
            <Carousel
              setApi={setApi}
              className="w-full"
              opts={{
                align: "center",
                loop: true,
                duration: 20,
                dragFree: true,
                containScroll: "trimSnaps",
              }}
            >
              <CarouselContent className="-ml-4">
                {galleryImages.map((image, index) => (
                  <CarouselItem key={index} className="pl-4 basis-4/5 md:basis-2/3 lg:basis-1/2 xl:basis-2/5 2xl:basis-1/3">
                    <div className="p-4">
                      <div className="aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl border-2 border-black bg-white hover:shadow-gray-400 transition-all duration-700 transform hover:scale-105">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-contain transition-transform duration-1000 hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
