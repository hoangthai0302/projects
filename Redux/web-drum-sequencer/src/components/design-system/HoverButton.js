import { Button } from './Button';

const getColor = (theme, color) => theme.colors[color] || color;

export const HoverButton = Button.extend`
  transition: all ${({ transitionSpeed }) => transitionSpeed}

  &:hover {
    color: ${({ theme, hoverColor }) => getColor(theme, hoverColor)};
    background-color: ${({ theme, hoverBg }) => getColor(theme, hoverBg)};
    opacity: ${({ hoverOpacity }) => hoverOpacity};
  }

  &:active {
    background-color: ${({ theme, activeBg }) => getColor(theme, activeBg)};
    opacity: ${({ hoverOpacity }) => hoverOpacity};
  }
`;
