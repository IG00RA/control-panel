import type { Schema, Struct } from '@strapi/strapi';

export interface VacancyAdvantages extends Struct.ComponentSchema {
  collectionName: 'components_vacancy_advantages';
  info: {
    description: '';
    displayName: 'Advantages';
    icon: 'shirt';
  };
  attributes: {
    Advantage: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface VacancyRequirements extends Struct.ComponentSchema {
  collectionName: 'components_vacancy_requirements';
  info: {
    description: '';
    displayName: 'Requirements';
    icon: 'feather';
  };
  attributes: {
    Requirement: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface VacancyResponsibilitiesShort extends Struct.ComponentSchema {
  collectionName: 'components_vacancy_responsibilities_shorts';
  info: {
    displayName: 'ResponsibilitiesShort';
    icon: 'car';
  };
  attributes: {
    ResponsibilityShort: Schema.Attribute.String;
  };
}

export interface VacancyResponsibility extends Struct.ComponentSchema {
  collectionName: 'components_vacancy_responsibilities';
  info: {
    description: '';
    displayName: 'Responsibility';
    icon: 'crown';
  };
  attributes: {
    Responsibility: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface VacancySkill extends Struct.ComponentSchema {
  collectionName: 'components_vacancy_skills';
  info: {
    description: '';
    displayName: 'Skill';
    icon: 'cloud';
  };
  attributes: {
    Skill: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'vacancy.advantages': VacancyAdvantages;
      'vacancy.requirements': VacancyRequirements;
      'vacancy.responsibilities-short': VacancyResponsibilitiesShort;
      'vacancy.responsibility': VacancyResponsibility;
      'vacancy.skill': VacancySkill;
    }
  }
}
