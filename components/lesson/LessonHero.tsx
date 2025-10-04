import RotatingText from '../RotatingText';

export function LessonHero() {
  return (
    <div className='mb-10 flex flex-col items-center'>
      <div className='flex items-center'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mr-2'>
          Learn
        </h1>
        <RotatingText
          texts={['Flow', 'Coding', 'Science', 'Everything', 'Anything']}
          mainClassName="px-2 sm:px-2 md:px-3 bg-secondary text-secondary-foreground overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg text-3xl sm:text-4xl md:text-5xl font-bold"
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={7000}
        />
      </div>

      <p className="text-muted-foreground text-center mt-4 max-w-2xl">
        AI-Powered Interactive Learning Experience
      </p>
    </div>
  );
}
