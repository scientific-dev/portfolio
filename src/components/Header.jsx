import React from 'react';

export default function Header(){

    window.addEventListener('scroll', () => {
        if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) document.querySelector('.header').classList.add('scrolled');
        else document.querySelector('.header').classList.remove('scrolled');
    });

    return <>
        <div className="header">
            <h2>Scientific Guy</h2>
            <span>
                <a href="/">Home</a>
                <a href="https://decimaldev.xyz">Development</a>
                <a href="https://guides.decimaldev.xyz">Blog</a>
            </span>
        </div>
    </>

}