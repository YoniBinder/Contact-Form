export interface FormComponentProps {
    match: Match;
  }
  export interface Params {
    id: string;
  };
  export interface Match {
    params: Params;
  };
  export interface Colors {
    main: string;
    title: string;
    background?: string;
    description: string;
    buttons?: string;
    buttonBackground?: string;
  };
  export interface Form {
    key: string;
    type: string;
    required: boolean;
  };
  export interface Action {
    label: string;
    type: number;
    end?: string;
    link?: string;
  };
  
  export interface Content {
    actions: Array<Action>;
    form: Array<Form>;
    type: number;
    message: string;
  };
  export interface Availability {
    eventEndIdx: number;
    afterEvents: Array<string>;
  };
  export interface Events {
    _id: string;
    content: Content;
    dependencies: Array<{ availability: Availability }>;
    title: string;
  };
  export interface ApiData {
    paths: Array<{ events: Array<Events>; _id: string }>;
    colors: Colors;
    title: string;
    _id: string;
  };