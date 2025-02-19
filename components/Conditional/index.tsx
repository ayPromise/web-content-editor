import React, { Fragment, ReactNode } from 'react'

interface ConditionalProps {
    showWhen: boolean;
    children: ReactNode;
}

const Conditional: React.FC<ConditionalProps> = ({ showWhen, children }) => {
    // if (showWhen) return children

    return <div className={`relative duration-300 ${showWhen ? 'opacity-100' : 'opacity-0'}`}>
        {children}
    </div>
    return <Fragment></Fragment>
}

export default Conditional