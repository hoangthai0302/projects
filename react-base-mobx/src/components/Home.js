import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import styled, { css } from 'styled-components';
import { IconDraft, IconEdit, IconMessage, IconRecycleBin, IconReview, IconPending } from 'components/Icons';

const Home = props => {
    
    return (
        <div>
            Home
            <Div className="">
                test
                <div>

                    <IconMessage />
                    <IconMessage active/>
                    <IconReview active  />
                    <IconDraft >Draft</IconDraft>
                    <IconRecycleBin />
                    <IconRecycleBin disabled />
                    <IconEdit disabled/>
                    <IconPending disabled>Pending</IconPending>
                </div>
            </Div>
        </div>
    );
};

export default Home;

const Div = styled.div`
    display: flex;
    align-items: center;
    
`