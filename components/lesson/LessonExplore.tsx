import { FocusCards } from "@/components/ui/focus-cards";

export function LessonExplore() {
  const cards = [
    {
      title: "Computer Programming",
      src: "https://upload.wikimedia.org/wikipedia/commons/0/0c/ENIAC-changing_a_tube_%28cropped%29.jpg",
      href: "/lessons/computer-programming"
    },
    {
      title: "Science",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO-VLT-Laser-phot-33a-07.jpg/960px-ESO-VLT-Laser-phot-33a-07.jpg",
      href: "/lessons/science"
    },
    {
      title: "Physics",
      src: "https://upload.wikimedia.org/wikipedia/commons/a/af/Einstein1921_by_F_Schmutzer_2.jpg",
      href: "/lessons/physics"
    }
  ];

  return (
    <div className="w-full mb-8 max-w-5xl mx-auto px-4 md:px-8 mt-10">
      <h1 className='text-2xl md:text-3xl font-semibold mb-6 text-left'>
        Explore:
      </h1>
      <FocusCards cards={cards} />
    </div>
  );
}
