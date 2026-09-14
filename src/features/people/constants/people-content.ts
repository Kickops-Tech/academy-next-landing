import peopleData from "@assets/data/people.json";

export type PeopleAgent = {
  id: string;
  agentNumber: number;
  name: string;
  imageSrc: string;
  imageAlt: string;
  paragraphs: string[];
};

export type PeopleHeadingCopy = {
  lead: string;
  display: string;
};

type PeopleContentFile = {
  section: {
    heading: PeopleHeadingCopy;
    carouselAriaLabel: string;
  };
  agents: PeopleAgent[];
};

const content = peopleData as PeopleContentFile;

function isFilledAgent(agent: PeopleAgent) {
  return (
    agent.id.trim().length > 0 &&
    agent.name.trim().length > 0 &&
    agent.imageSrc.trim().length > 0
  );
}

/** Section heading strings from `src/assets/data/people.json`. */
export const PEOPLE_HEADING = content.section.heading;

/** Carousel tablist / region label from JSON. */
export const PEOPLE_CAROUSEL_ARIA_LABEL = content.section.carouselAriaLabel;

/**
 * Agents ready to render — skips template rows still missing id/name/image.
 * Source of truth: `src/assets/data/people.json`.
 */
export const PEOPLE_AGENTS: PeopleAgent[] = content.agents.filter(isFilledAgent);
