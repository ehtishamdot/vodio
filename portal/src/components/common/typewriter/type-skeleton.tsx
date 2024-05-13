import Typewriter from "typewriter-effect";

export function TypeSkeleton() {
    return (
        <div className={`py-7 h-fit dark:bg-neutral-900 bg-neutral-100`}>
            <div className="flex flex-row gap-6 w-[50%] max-[900px]:w-[88%]  mx-auto items-start">
                <span className="leading-8">
          <Typewriter
              options={{
                  delay: 20,
                  loop: true,
                  autoStart: true,
              }}
              onInit={(typewriter) => {
                  typewriter.typeString("...").start();
              }}
          />
        </span>
            </div>
        </div>
    );
}