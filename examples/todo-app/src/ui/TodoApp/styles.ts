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
    `button`,
    {
      margin: 0,
      padding: 0,
      border: 0,
      background: `none`,
      fontSize: `100%`,
      verticalAlign: `baseline`,
      fontFamily: `inherit`,
      fontWeight: 'inherit',
      color: `inherit`,
      '-webkit-appearance': `none`,
      appearance: 'none',
      '-webkit-font-smoothing': `antialiased`,
      '-moz-osx-font-smoothing': `grayscale`,
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

  export const newTodoClass = style(
    { $debugName: `todo-app_new-todo` },
    itemInput,
    {
      padding: `16px 16px 16px 60px`,
      border: `none`,
      background: `rgba(0, 0, 0, 0.003)`,
      boxShadow: `inset 0 -2px 1px rgba(0, 0, 0, 0.03)`,
    },
  );

  export const mainClass = style(
    { $debugName: `todo-app_main` },
    {
      position: 'relative',
      zIndex: 2,
      borderTop: `1px solid #e6e6e6`,
    },
  );

  cssRule(
    `label[for='toggle-all']`,
    {
      display: `none`,
    },
  );

  export const toggleAllClass = style(
    { $debugName: `todo-app_toggle-all` },
    {
      position: 'absolute',
      top: `-55px`,
      left: `-12px`,
      width: `60px`,
      height: `34px`,
      textAlign: 'center',
      border: `none`,
      $nest: {
        '&::before': {
          content: `'❯'`,
          fontSize: `22px`,
          color: `#e6e6e6`,
          padding: `10px 27px 10px 27px`,
        },
        '&:checked::before': {
          color: `#737373`,
        },
        '@media screen and (-webkit-min-device-pixel-ratio: 0)': {
          background: `none`,
          '-webkit-transform': `rotate(90deg)`,
          transform: `rotate(90deg)`,
          '-webkit-appearance': `none`,
          appearance: 'none',
        },
      },
    },
  );

  export const todoListClass = style(
    { $debugName: `todo-app_todo-list` },
    {
      margin: 0,
      padding: 0,
      listStyle: `none`,
    },
  );

  export const footerClass = style(
    { $debugName: `todo-app_footer` },
    {
      color: `#777`,
      padding: `10px 15px`,
      height: `20px`,
      textAlign: 'center',
      borderTop: `1px solid #e6e6e6`,
      $nest: {
        '&::before': {
          content: `''`,
          position: 'absolute',
          right: 0,
          bottom: 0,
          left: 0,
          height: `50px`,
          overflow: 'hidden',
          boxShadow: `0 1px 1px rgba(0, 0, 0, 0.2),
                      0 8px 0 -3px #f6f6f6,
                      0 9px 1px -3px rgba(0, 0, 0, 0.2),
                      0 16px 0 -6px #f6f6f6,
                      0 17px 2px -6px rgba(0, 0, 0, 0.2)`,
        },
      },
    },
  );

  export const todoCountClass = style(
    { $debugName: `todo-app_todo-count` },
    {
      float: 'left',
      textAlign: 'left',
      $nest: {
        '& strong': {
          fontWeight: 300,
        },
      },
    },
  );

  export const selectedClass = style(
    { $debugName: `todo-app_selected` },
  );

  export const filtersClass = style(
    { $debugName: `todo-app_filters` },
    {
      margin: 0,
      padding: 0,
      listStyle: `none`,
      position: 'absolute',
      right: 0,
      left: 0,
      $nest: {
        '& li': {
          display: `inline`,
          $nest: {
            '& a': {
              color: `inherit`,
              margin: `3px`,
              padding: `3px 7px`,
              textDecoration: `none`,
              border: `1px solid transparent`,
              borderRadius: `3px`,
              $nest: {
                '&:hover': {
                  borderColor: `rgba(175, 47, 47, 0.1)`,
                },
                [`&.${selectedClass}`]: {
                  borderColor: `rgba(175, 47, 47, 0.2)`,
                },
              },
            },
          },
        },
      },
    },
  );

  export const clearCompletedClass = style(
    { $debugName: `todo-app_clear-completed` },
    {
      float: 'right',
      position: 'relative',
      lineHeight: `20px`,
      textDecoration: `none`,
      cursor: `pointer`,
      $nest: {
        '&:hover': {
          textDecoration: `underline`,
        },
      },
    },
  );

  export const hideClass = style(
    { $debugName: `todo-app_hide` },
    {
      display: `none`,
    },
  );
}
