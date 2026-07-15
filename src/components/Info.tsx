import { Link } from "react-router-dom";

import { arrow } from "../assets/icons";
import { InfoboxType, InfoPropsTypes } from "../types";

const InfoBox = ({ text, link, btnText }: InfoboxType) => (
  <div className="info-box">
    <p className="font-medium sm:text-xl text-center">{text}</p>
    <Link to={link} className="neo-brutalism-white neo-btn">
      {btnText}
      <img src={arrow} className="w-4 h-4 object-contain" />
    </Link>
  </div>
);

function Info({
  currentStage,
  name,
  tagline,
  infoStage2,
  infoStage3,
  infoStage4,
}: InfoPropsTypes) {
  const renderContent = {
    1: (
      <h1 className="sm:text-xl sm:leading-snug text-center neo-brutalism-blue py-4 px-8 text-white mx-5">
        Hi, I am <span className="font-semibold">{name}</span>👋
        <br />
        {tagline}
      </h1>
    ),
    2: <InfoBox text={infoStage2} link="/about" btnText="Learn more" />,
    3: <InfoBox text={infoStage3} link="/projects" btnText="Visit my portfolio" />,
    4: <InfoBox text={infoStage4} link="/contacts" btnText="Let's talk" />,
  };

  return renderContent[currentStage as keyof typeof renderContent];
}

export default Info;
