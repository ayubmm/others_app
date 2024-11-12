export interface EventData {
  id: string;
  images: string;
  title: string;
  location: string;
}

// Define the type for your navigation routes
export type RootStackParamList = {
  index: undefined; // No params for index screen
  "detail/detailevent": { id: string }; // Params for register screen inside tabs
  "detail/detailberita": { slug: string }; // Params for register screen inside tabs
  "detail/detailjobs": { id: string }; // Params for register screen inside tabs
  "detail/detailmentor": { id: string }; // Params for register screen inside tabs

  "registrasi/registrasimentorship": undefined;
  "form/formmentor": undefined;
  "form/formmentee": undefined;
  "(tabs)": undefined; // No params for the main tabs screen
  "(login)/index": undefined; // No params for login screen
  splash: undefined; // No params for splash screen
  // Add more screens and their params as needed
};
