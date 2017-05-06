import { cssRaw, style, types } from 'typestyle'

export namespace TodoItemStyles {

  export const destroyClass = style(
    { $debugName: `todo-app_item-destroy` },
    {
      display: `none`,
      position: 'absolute',
      top: 0,
      right: `10px`,
      bottom: 0,
      width: `40px`,
      height: `40px`,
      margin: `auto 0`,
      fontSize: `30px`,
      color: `#cc9a9a`,
      marginBottom: `11px`,
      transition: `color 0.2s ease-out`,
      $nest: {
        '&:hover': {
          color: `#af5b5e`,
        },
        '&::after': {
          content: `'×'`,
        },
      },
    },
  )

  export const labelClass = style(
    { $debugName: `todo-app_item-label` },
    {
      wordBreak: 'break-all',
      padding: `15px 60px 15px 15px`,
      marginLeft: `45px`,
      display: `block`,
      lineHeight: 1.2,
      transition: `color 0.4s`,
    },
  )

  export const completedClass = style(
    { $debugName: `todo-app_item-completed` },
  )

  export const itemClass = style(
    { $debugName: `todo-app_item` },
    {
      position: 'relative',
      fontSize: `24px`,
      borderBottom: `1px solid #ededed`,
      $nest: {
        [`&:hover .${destroyClass}`]: {
          display: `block`,
        },
        [`&.${completedClass} .${labelClass}`]: {
          color: `#d9d9d9`,
          textDecoration: `line-through`,
        },
      },
    },
  )

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
          background: 0,
          height: `40px`,
        },
      },
    },
  )

  const toggleSvg = `url(\'data:image/svg+xml;utf8,` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"` +
    ` viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" ` +
    `stroke="#ededed" stroke-width="3"/></svg>\')`

  cssRaw(`.${toggleClass}::after { content: ${toggleSvg} }`)

  const toggleCheckedSvg = `url(\'data:image/svg+xml;utf8,` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" ` +
    `viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" ` +
    `stroke="#bddad5" stroke-width="3"/>` +
    `<path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>\')`

  cssRaw(`.${toggleClass}:checked::after { content: ${toggleCheckedSvg} }`)

  const displayNone: types.NestedCSSProperties =
    {
      display: `none`,
    }

  export const editingClass = style(
    { $debugName: `todo-app_item-editing` },
    {
      borderBottom: `none`,
      padding: 0,
      $nest: {
        [`& .${labelClass}`]: displayNone,
        [`& .${destroyClass}`]: displayNone,
        [`& .${toggleClass}`]: displayNone,
      },
    },
  )

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
    }

  export const editClass = style(
    { $debugName: `todo-app_item-edit` },
    itemInput,
    {
      display: `block`,
      width: `506px`,
      padding: `12px 16px`,
      margin: `0 0 0 43px`,
    },
  )

  export const hideClass = style(
    { $debugName: `todo-app_hide` },
    {
      display: `none`,
    },
  )
}
