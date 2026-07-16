import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

import { ExperienceRow, SkillRow } from "../types";
import { useTable } from "../hooks/useTable";
import { useProfile } from "../hooks/useProfile";
import {
  CTA,
  ProfileHeaderSkeleton,
  SkillsSkeleton,
  ExperienceSkeleton,
} from "../components";

function About() {
  const { data: skills, loading: skillsLoading } = useTable<SkillRow>("skills");
  const { data: experiences, loading: experiencesLoading } =
    useTable<ExperienceRow>("experiences");
  const { profile, loading: profileLoading } = useProfile();

  const companyIcon = (experience: ExperienceRow) => (
    <div className="flex justify-center items-center w-full h-full">
      {experience.icon_url && (
        <img
          src={experience.icon_url}
          alt={experience.company_name}
          className="w-[60%] h-[60%] object-contain"
        />
      )}
    </div>
  );
  return (
    <section className="max-container">
      {profileLoading || !profile ? (
        <ProfileHeaderSkeleton />
      ) : (
        <>
          <h1 className="head-text">
            Hello, I'm{" "}
            <span className="blue-gradient_text font-semibold drop-shadow">
              {profile.name}
            </span>
          </h1>
          <div className="mt-5 flex flex-col gap-3 text-slate-500">
            <p>{profile.bio}</p>
          </div>
        </>
      )}
      <div className="py-10 flex flex-col">
        <h3 className="subhead-text">My Skills</h3>

        {skillsLoading ? (
          <SkillsSkeleton />
        ) : (
          <div className="mt-16 flex flex-wrap gap-12">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="block-container w-20 h-20"
                title={skill.name}
              >
                <div className="btn-back rounded-xl" />
                <div className="btn-front rounded-xl flex justify-center items-center">
                  {skill.icon_url && (
                    <img
                      src={skill.icon_url}
                      alt={skill.name}
                      className="w-1/2 h-1/2 object-contain"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="py-16 ">
        <h3 className="subhead-text">Work Experience</h3>
        <div className="mt-5 flex flex-col gap-3 text-slate-500">
          <p>
            T've worked with all sorts of companies, leveling up my skills and
            teaming up with smart people. Here's the rundown:
          </p>
        </div>

        {experiencesLoading ? (
          <ExperienceSkeleton />
        ) : (
          <div className="mt-12 flex">
            <VerticalTimeline>
              {experiences.map((experience) => (
                <VerticalTimelineElement
                  key={experience.id}
                  date={experience.date}
                  icon={companyIcon(experience)}
                  iconStyle={{ background: experience.icon_bg ?? undefined }}
                  contentStyle={{
                    borderBottom: "8px",
                    borderStyle: "solid",
                    borderBottomColor: experience.icon_bg ?? undefined,
                    boxShadow: "none",
                  }}
                >
                  <div>
                    <h3 className="text-black text-xl font-poppins font-semibold">
                      {experience.title}
                    </h3>
                    <p className="text-black-500 font-medium font-base m-0">
                      {experience.company_name}
                    </p>
                  </div>

                  <ul className="my-5 list-disc ml-5 space-y-2">
                    {experience.points.map((point, index) => (
                      <li
                        key={`expirence-point-${index}`}
                        className="text-black-500/50 font-normal pl-1 text-sm"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </VerticalTimelineElement>
              ))}
            </VerticalTimeline>
          </div>
        )}
      </div>

      <hr className="border-slate-200" />

      <CTA />
    </section>
  );
}

export default About;
