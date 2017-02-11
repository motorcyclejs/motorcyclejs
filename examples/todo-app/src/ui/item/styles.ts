import { style } from 'typestyle';

export namespace ItemStyles {
  export const item = style(
    { $debugName: `todo-app_item` },
    {
      position: 'relative',
      fontSize: `24px`,
      borderBottom: `1px solid #ededed`,
    }
  );

  const toggleSvg = `url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>\')`;

  export const toggle = style(
    { $debugName: `todo-app_item-toggle` },
    {
      textAlign: 'center',
      width: `40px`,
      height: `auto`,
      position: 'absolute',
      top: 0,
      bottom: 0,
      margin: `auto 0`,
      '-webkit-appearance': `none`,
      appearance: 'none',
      $nest: {
        '&::after': {
          content: `' '`,
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>')`,
        },
      },
    }
  );

  export const label = style(
    { $debugName: `todo-app_item-label`},
    {
      wordBreak: 'break-all',
      padding: `15px 60px 15px 15px`,
      marginLeft: `45px`,
      display: `block`,
      lineHeight: 1.2,
      transition: `color 0.4s`,
    }
  );
}
