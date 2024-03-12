import { PaperClipIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef } from "react";
import Typing from "./Typing";
import { cn } from "@/lib/utils";
import { Squircle } from "@squircle-js/react";

interface ChatBarProps {
  className?: string;
  userInput: string;
  setUserInput: (input: string) => void;
  typing: boolean;
  [x: string]: any;
}

export default function ChatBar({ userInput, setUserInput, typing, className, ...rest }: ChatBarProps) {
  // Dynamically expand the text area to fit the user's input
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea == null) {
      return;
    }
    textarea.style.height = "24px";
    textarea.style.height = textarea.scrollHeight + "px";
  }, [userInput]);

  // Send message handler
  async function doSendMessage() {
    if (userInput.length == 0) {
      return;
    }
    // TODO
  }

  const base =
    "flex min-h-fit w-full shrink-0  space-x-2 border-[3px] focus-within:border-stone-600 border-transparent bg-[#4F4F4F] p-3 px-4 transition duration-200 ease-out ";
  return (
    <>
      <div className="flex h-4 w-fit items-center ">
        <Typing className="mb-3" name="Saku" typing={typing} />
      </div>
      <Squircle cornerRadius={50} cornerSmoothing={1} className={cn(base, className)}>
        <div className="h-fit w-fit">
          <button className="flex size-6 items-center justify-center text-neutral-400 hover:text-neutral-300">
            <PaperClipIcon className="h-6 w-6" />
          </button>
        </div>
        {/* Textarea wrapper */}
        <textarea
          onInput={(e) => setUserInput(e.currentTarget.value)}
          ref={textAreaRef}
          maxLength={1024}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              doSendMessage();
              // Prevent inserting a new line on pressing enter
              e.preventDefault();
            }
          }}
          value={userInput}
          placeholder={`Message @Saku`}
          className="h-6 max-h-64 w-full resize-none bg-inherit px-2 focus:outline-none"
        />
        {/* Send button */}
        <button onClick={() => doSendMessage()} className="h-fit w-fit ">
          <PaperAirplaneIcon className="h-7 w-7 fill-[#E04B93]  transition duration-200 ease-out hover:fill-orange-300  " />
        </button>
      </Squircle>
    </>
  );
}
