import { cssRule, style, types } from 'typestyle';

export namespace todoAppStyles {
  cssRule(
    `body`,
    {
      font: `14px 'Helvetica Neue', Helvetica, Arial, sans-serif`,
      lineHeight: `1.4em`,
      background: `#f5f5f5`,
      color: `#4d4d4d`,
      minWidth: `230px`,
      maxWidth: `550px`,
      margin: `0 auto`,
      '-webkit-font-smoothing': `antialiased`,
      '-moz-osx-font-smoothing': `grayscale`,
      'fontWeight': 300,
    },
  );

  cssRule(
    `:focus`,
    {
      outline: 0,
    },
  );

  const inputPlaceholder: types.NestedCSSProperties =
    {
      $unique: true,
      fontStyle: 'italic',
      fontWeight: 300,
      color: `#e6e6e6`,
    };

  const itemInput: types.NestedCSSProperties =
    {
      position: 'relative',
      margin: 0,
      width: `100%`,
      fontSize: `24px`,
      fontFamily: `inherit`,
      fontWeight: 'inherit',
      lineHeight: `1.4em`,
      color: `inherit`,
      padding: `6px`,
      border: `1px solid #999`,
      boxShadow: `inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2)`,
      boxSizing: 'border-box',
      '-webkit-font-smoothing': `antialiased`,
      '-moz-osx-font-smoothing': `grayscale`,
    };

  export const hostClass = style(
    { $debugName: `todo-app` },
    {
      background: `#fff`,
      margin: `130px 0 40px 0`,
      position: 'relative',
      boxShadow: `0 2px 4px 0 rgba(0, 0, 0, 0.2),
                  0 25px 50px 0 rgba(0, 0, 0, 0.1)`,
      $nest: {
        '& input': {
          $nest: {
            '&::-webkit-input-placeholder': inputPlaceholder,
            '&::-moz-placeholder': inputPlaceholder,
            '&::input-placeholder': inputPlaceholder,
          },
        },
      },
    },
  );

  export const headingClass = style(
    { $debugName: `todo-app_heading` },
    {
      position: 'absolute',
      top: `-155px`,
      width: `100%`,
      fontSize: `100px`,
      fontWeight: 100,
      textAlign: 'center',
      color: `rgba(175, 47, 47, 0.15)`,
      textRendering: 'optimizeLegibility',
    },
  );

  export const editClass = style(
    { $debugName: `todo-app_edit` },
    itemInput,
  );

  export const newItemClass = style(
    { $debugName: `todo-app_new-item` },
    itemInput,
    {
      padding: `16px 16px 16px 60px`,
      border: `none`,
      background: `rgba(0, 0, 0, 0.003)`,
      boxShadow: `inset 0 -2px 1px rgba(0, 0, 0, 0.03)`,
    },
  );

  export const itemsClass = style(
    { $debugName: `todo-app_items` },
    {
      margin: 0,
      padding: 0,
      listStyle: `none`,
    },
  );
}
