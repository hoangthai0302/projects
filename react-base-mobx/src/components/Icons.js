
import React from 'react';
import styled, { css } from 'styled-components';

const Icon = styled.span`
position: relative;
${props => props.active && 
    css`
        &:after {
            content: ' ';
            display: block;
            position: absolute;
            width: 6px;
            height: 6px;
            background: #0062FF;
            border-radius: 9px;
            right: -1px;
            top: -2px
        }

        &.pme-icon--review {
            font-size: 1.1em;
            &:after {
                right: 3px;
                top: 0px;
            }
        }
      
    `
}

${props => props.disabled &&
    css`
        opacity: .4;
    `
}
`;

export const IconDraft = ({ children, ...others}) => <Draft className="icon-draft" {...others}>
                                        <Icon className="pme-icon--draft" {...others}/>
                                        <span className="text">{children}</span>
                                    </Draft>

export const IconMessage = (props) => <Icon className="pme-icon--message" {...props}/>
export const IconReview = (props) => <Icon className="pme-icon--review" {...props}/>
export const IconRecycleBin = (props) => <Icon className="pme-icon--recyclebin" {...props}/>
export const IconEdit = (props) => <Icon className="pme-icon--edit"{...props} />
export const IconPending = ({ children, ...others}) => <Pending className="icon-pending" {...others}>
                                        <Icon className="pme-icon--pending" {...others}/>
                                        <span className="text">{children}</span>
                                    </Pending>

const Draft = styled.span`
    display: inline-flex;
    align-items: center;
    .text {
        color: #9B9B9B;
        font-size: .8em;
        font-weight: bold;
        position: relative;
        bottom: 2px;
    }
`
const Pending = styled.span`
    display: inline-flex;
    align-items: center;
    .text {
        color: #FFAD00;
        font-size: .8em;
        font-weight: bold;
        position: relative;
        margin-left: 2px;
        bottom: 1px;
    }
`