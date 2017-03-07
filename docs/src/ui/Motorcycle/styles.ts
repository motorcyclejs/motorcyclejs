import { centerCenter, flex, flexRoot, horizontallySpaced } from 'csstips';
import { cssRule, media, style } from 'typestyle';

export const colors =
  {
    darkBg: `#2D242D`,
    primary: `#F56E1F`,
    secondary: `#FBAB18`,
  };

const small = { minWidth: 0, maxWidth: 600 };
const medium = { minWidth: 601, maxWidth: 1200 };

const padSides = (amount: number) =>
  ({ paddingLeft: `${amount}em`, paddingRight: `${amount}em` });

cssRule(
  'html, body',
  {
    fontSize: `12px`,
  },
  media(small, { fontSize: '8px' }),
  media(medium, { fontSize: '10px' }),
);

const buttonStyle = (color: string) =>
  style(
    {
      color: color,
      background: `none`,
      border: `2px dotted ${color}`,
      borderRadius: `.8em`,
      margin: `1em`,
      padding: `1em`,
      outline: `none`,
      $nest: {
        '&:hover': {
          transform: `scale(1.1);`,
        },
      },
    },
  );

export const documentation = buttonStyle(colors.primary);
export const github = buttonStyle(colors.secondary);

export const host =
  style(
    flex,
    {
      maxWidth: '800px',
      margin: '0 auto',
      paddingTop: '3em',
      justifyContent: 'center',
      alignItems: 'center',
    },
    media(small, padSides(4)),
    media(medium, padSides(10)),
  );

export const header =
  style(flexRoot, horizontallySpaced, centerCenter);

export const logo =
  style(
    {
      height: '10em',
      width: '10em',
      $nest: {
        '&:hover': {
          transform: `scale(1.1);`,
        },
      },
    },
    media(small, { height: '6em', width: '6em' }),
    media(medium, { height: '8em', width: '8em' }),
  );

export const motorcycle =
  style(
    {
      fontSize: '4.2em',
      fontWeight: 'bolder',
      paddingLeft: `1.2em`,
      paddingRight: `1.2em`,
    },
    media(small, padSides(0.4)),
    media(media, padSides(0.8)),
  );

export const tagLine =
  style(
    flex,
    centerCenter,
    {
      textAlign: 'center',
      fontSize: `1.6em`,
    },
    media(small, { fontSize: `1.2em` }),
    media(medium, { fontSize: `1.4em` }),
  );

export const buttonSection =
  style(
    centerCenter,
    flexRoot,
    {
      flexDirection: `column`,
      marginTop: `1.6em`,
      marginBottom: `1.6em`,
      fontSize: `1.6em`,
    },
  );
