import Typewriter from "typewriter-effect";
import {useState} from "react";

export default function TypeOnce({ children }: { children: string }) {
    const [on, setOn] = useState(true);
    return on ? (
        <Typewriter
            options={{
                delay: 60,
            }}
            onInit={(typewriter) => {
                typewriter
                    .typeString(children)
                    .pause()
                    .start()
                    .callFunction(() => {
                        setOn(false);
                    });
            }}
        />
    ) : (
        children
    );
}