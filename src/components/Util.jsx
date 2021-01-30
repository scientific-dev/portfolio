/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import proptypes from 'prop-types';

function SocialCard({ icon, href, color, className = '' }){

    return <>
        <a style={{ backgroundColor: color, cursor: 'pointer' }} className={`socialcard ${className}`} onClick={() => window.open(href)}><i className={`fab fa-${icon}`}/></a>
    </>

}

function Section({ number, name, children, className = '' }){

    return <div className={`section ${className}`}>
        <span className="title"><span>{number}.</span> {name}</span>
        <div className="scontent">{children}</div>
    </div>

}

function Footer(){

    return <div className="footer">
        © <strong>Scientific-Guy</strong> 2021
    </div>

}

SocialCard.propTypes = {
    icon: proptypes.string.isRequired,
    href: proptypes.string.isRequired,
    color: proptypes.string.isRequired,
    className: proptypes.string
}

Section.propTypes = {
    number: proptypes.string.isRequired,
    name: proptypes.string.isRequired,
    children: proptypes.node.isRequired,
    className: proptypes.string
}

const FriendLinks = {
    'abh80': 'https://starstracker.xyz',
    'shade': 'https://shadeoxide.gq',
    'kazult': 'https://discord.gg/bA3kksz4tN'
}

export { SocialCard, Section, Footer, FriendLinks };