import React, { Fragment, ReactNode } from 'react'

interface ConditionalProps {
    showWhen: boolean;
    children: ReactNode;
}

const Conditional: React.FC<ConditionalProps> = ({ showWhen, children }) => {
    if (showWhen) return children

    return <Fragment></Fragment>
}

export default Conditional