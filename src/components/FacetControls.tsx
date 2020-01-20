import * as React from "react";

export default props => {
    const { removeFunction, focusFunction, dxSettings, facetIndex } = props
    return <div>
        <button onClick={() => { removeFunction(facetIndex) }}>Remove</button>
        <button onClick={() => { focusFunction(dxSettings) }}>Focus</button>
    </div>
}