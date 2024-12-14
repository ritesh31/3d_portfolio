import { Suspense, useState, SyntheticEvent, ChangeEvent } from "react";
import { Canvas } from "@react-three/fiber";

import { Fox } from "../models";
import { Loader, Alert } from "../components";
import useAlert from "../hooks/useAlert";


function Contacts() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const { alert, showAlert, hideAlert } = useAlert();

  const handleOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleOnFocus = () => setCurrentAnimation("walk");

  const handleOnBlur = () => setCurrentAnimation("idle");

  const handleOnSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(form);
    setIsLoading(true);
    setCurrentAnimation("hit");
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setCurrentAnimation("idle");
      showAlert({ text: "Message sent successfully!", type: "success" });
      clearTimeout(timeout);
    }, 3000);

    const timeout2 = setTimeout(() => {
      hideAlert();
      clearTimeout(timeout2);
    }, 7000);
  };

  return (
    <section className="relative flex lg:flex-row flex-col max-container h-[100vh]">
      {alert.show && <Alert {...alert} />}

      <div className="flex-1 min-w-[50%] flex flex-col">
        <h1 className="head-text">Get in Touch</h1>

        <form
          className="w-full flex flex-col gap-7 mt-14"
          onSubmit={handleOnSubmit}
        >
          <label className="text-black-500 font-semibold">
            Name
            <input
              type="text"
              name="name"
              className="input"
              value={form.name}
              placeholder="Enter name"
              onChange={handleOnChange}
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              required
            />
          </label>
          <label className="text-black-500 font-semibold">
            Email
            <input
              type="email"
              name="email"
              className="input"
              value={form.email}
              placeholder="Enter email"
              onChange={handleOnChange}
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              required
            />
          </label>
          <label className="text-black-500 font-semibold">
            Your Message
            <textarea
              name="message"
              rows={5}
              className="textarea"
              value={form.message}
              placeholder="Let me knoe how can I help you!"
              onChange={handleOnChange}
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              required
            />
          </label>
          <button
            type="submit"
            className="btn"
            disabled={isLoading}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      <div className="lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]">
        <Canvas camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}>
          <directionalLight intensity={2.5} position={[0, 0, 1]} />
          <ambientLight intensity={0.5} />
          <Suspense fallback={<Loader />}>
            <Fox
              currentAnimation={currentAnimation}
              position={[0.5, 0.35, 0]}
              rotation={[12.6, -0.6, 0]}
              scale={[0.5, 0.5, 0.5]}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}

export default Contacts;
