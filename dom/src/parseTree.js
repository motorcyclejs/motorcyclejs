import Most from 'most';
import assign from 'fast.js/object/assign';

function combineVTreeStreams( vTree, ...children ) {
  return assign( vTree, { children });
}

function parseTree( vTree ) {
  if ( vTree.observe ) {
    return vTree.flatMap( parseTree );
  } else if ( `object` === typeof vTree && Array.isArray( vTree.children ) &&
    vTree.children.length > 0 )
  {
    return Most.combine(
      combineVTreeStreams,
      Most.just( vTree ),
      ...vTree.children.map( parseTree )
    );
  } else if ( `object` === typeof vTree ) {
    return Most.just( vTree );
  } else {
    throw new Error( `Unhandled tree value` );
  }
}

export default parseTree;
export { parseTree };
