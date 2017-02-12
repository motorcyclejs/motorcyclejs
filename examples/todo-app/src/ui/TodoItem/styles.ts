import { cssRaw, style } from 'typestyle';

export namespace TodoItemStyles {
  export const itemClass = style(
    { $debugName: `todo-app_item` },
    {
      position: 'relative',
      fontSize: `24px`,
      borderBottom: `1px solid #ededed`,
    },
  );

  export const toggleClass = style(
    { $debugName: `todo-app_item-toggle` },
    {
      textAlign: 'center',
      width: `40px`,
      height: `auto`,
      position: 'absolute',
      top: 0,
      bottom: 0,
      border: `none`,
      margin: `auto 0`,
      '-webkit-appearance': `none`,
      appearance: 'none',
      $nest: {
        '@media screen and (-webkit-min-device-pixel-ratio: 0)': {
          height: `40px`,
        },
      },
    },
  );

  const toggleSvg = `url(\'data:image/svg+xml;utf8,` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"` +
    ` viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" ` +
    `stroke="#ededed" stroke-width="3"/></svg>\')`;

  cssRaw(`.${toggleClass}::after { content: ${toggleSvg} }`);

  export const labelClass = style(
    { $debugName: `todo-app_item-label`},
    {
      wordBreak: 'break-all',
      padding: `15px 60px 15px 15px`,
      marginLeft: `45px`,
      display: `block`,
      lineHeight: 1.2,
      transition: `color 0.4s`,
    },
  );

  export const labelCompletedClass = style(
    { $debugName: `todo-app_item-label-completed` },
    {
      color: `#d9d9d9`,
      textDecoration: `line-through`,
    },
  );
}
