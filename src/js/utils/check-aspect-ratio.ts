const checkAspectRation = (): boolean => {
  return window.matchMedia(
    '(min-aspect-ratio: 16/13) and (max-aspect-ratio: 16/7)'
  ).matches;
};

export const VALID_ASPECT_RATIO = checkAspectRation();
