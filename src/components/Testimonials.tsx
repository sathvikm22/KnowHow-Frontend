import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useEffect, useState } from "react"

const Testimonials = () => {
  const [api, setApi] = useState<any>()

  const galleryImages = [
    { src: "/lovable-uploads/1.jpeg", alt: "Gallery image 1" },
    { src: "/lovable-uploads/2.jpeg", alt: "Gallery image 2" },
    { src: "/lovable-uploads/3.jpeg", alt: "Gallery image 3" },
    { src: "/lovable-uploads/4.jpeg", alt: "Gallery image 4" },
    { src: "/lovable-uploads/5.jpeg", alt: "Gallery image 5" },
    { src: "/lovable-uploads/6.jpeg", alt: "Gallery image 6" },
    { src: "/lovable-uploads/7.jpeg", alt: "Gallery image 7" },
    { src: "/lovable-uploads/8.jpeg", alt: "Gallery image 8" },
    { src: "/lovable-uploads/9.jpeg", alt: "Gallery image 9" },
    { src: "/lovable-uploads/10.jpeg", alt: "Gallery image 10" },
    { src: "/lovable-uploads/11.jpeg", alt: "Gallery image 11" },
    { src: "/lovable-uploads/12.jpeg", alt: "Gallery image 12" },
    { src: "/lovable-uploads/13.jpeg", alt: "Gallery image 13" },
    { src: "/lovable-uploads/14.jpeg", alt: "Gallery image 14" },
    { src: "/lovable-uploads/15.jpeg", alt: "Gallery image 15" },
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
    <section id="testimonials" className="py-20 bg-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Studio Gallery
          </h2>
          <div className="w-20 h-1 bg-pink-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a glimpse into our vibrant creative spaces where artistry comes to life
          </p>
        </div>

        {/* White Rectangle Container */}
        <div className="bg-white rounded-3xl p-2 mx-auto max-w-7xl shadow-2xl border-4 border-pink-200/60 relative">
          <div className="absolute -inset-1 rounded-3xl pointer-events-none z-0 bg-gradient-to-r from-pink-400 via-orange-300 to-blue-400 blur-lg opacity-40 animate-pulse"></div>
          <div className="relative overflow-hidden rounded-2xl p-2 sm:p-4 md:p-6 lg:p-8 bg-white z-10">
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
                      <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl border-2 border-cyan-200 bg-white hover:shadow-pink-300 transition-all duration-700 transform hover:scale-105">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className={`w-full h-full object-cover transition-transform duration-1000 hover:scale-110${image.src.includes('9.jpeg') || image.src.includes('15.jpeg') ? '' : ''}`}
                          style={image.src.includes('9.jpeg') || image.src.includes('15.jpeg') ? { objectPosition: 'center 70%' } : {}}
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
