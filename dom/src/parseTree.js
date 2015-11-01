import Most from 'most';

function parseTree( vTree ) {
  // Child is a observable
  if ( vTree.observe ) {
    return vTree.flatMap( parseTree );
  } else if ( `object` === typeof vTree && Array.isArray( vTree.children ) &&
    vTree.children.length > 0 )
  {
    return Most
      .combine( ( ...children ) => {
        return Object.assign( vTree, { children });
      }, vTree.children.map( parseTree ) );
  } else if ( `object` === typeof vTree ) {
    return Most.just( vTree );
  } else {
    throw new Error( `Unhandled tree value` );
  }
}

export default parseTree;
export { parseTree };
