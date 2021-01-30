/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Header from '../components/Header';
import ProjectTab from '../components/ProjectTab';
import { SocialCard, Section, Footer, FriendLinks } from '../components/Util';

export default function Home(){

    let roles = ['A Web Developer', 'A Software Developer', 'An Animator', ' A Youtuber'];
    let currentDate = new Date();

    setInterval(() => {
        document.querySelector('.pcover font').innerHTML = roles[Math.floor(Math.random() * roles.length)];
    }, 50000)

    return <>
        <Header/>

        <div className="pcover">
            <div className="content">
                <h1>Scientific-Guy!</h1>
                <font className="role">Web Developer</font><br/>
                <font className="about">I am a high school student who likes to do programming and stuff. I mostly build websites and user interfaces! I like both frontend and backend web development. I make youtube videos for others to help them learn things and i animate rarely.</font>
            </div>

            <div className="socialcards">
                <SocialCard icon="youtube" href="https://www.youtube.com/channel/UCu6B4Z62fiCT_mwwHlc84iQ" color="#FF0000"/>
                <SocialCard icon="github" href="https://github.com/Scientific-Guy" color="#211F1F"/>
                <SocialCard icon="twitter" href="https://twitter.com/ScientificDev" color="#1DA1F2"/>
                <SocialCard icon="discord" href="https://discord.gg/FrduEZd" color="#7298da" className="discord-icon"/>
            </div>
        </div>

        <div className="sections">
            <Section number="01" name="About me" className="babout">
                <div className="flex">
                    <div className="flex-bef">
                        <img
                            src="https://cdn.discordapp.com/avatars/662207542486630401/f905247207d131db59197b1fd51a0f86.png?size=2048"
                            alt="Avatar"
                            style={{
                                borderRadius: '100%',
                                width: '200px',
                                border: '3px solid var(--cyan)',
                                cursor: 'pointer'
                            }}
                            draggable="false"
                        />
                    </div>
                    <div className="flex-op">
                        <strong>Name: </strong><font>Scientific-Guy</font><br/>
                        <strong>Date of Birth: </strong><font>21st June</font><br/>
                        <strong>Mail: </strong><font>scientificguy007@gmail.com</font><br/>
                        <strong>Experience: </strong><font>{currentDate.getFullYear() - 2018} years</font><br/>
                        <strong>Location: </strong><font>Chennai, Tamilnadu, India</font><br/>
                        <strong>Aka: </strong><font>NO U, Science Spot</font><br/>
                        <strong>Favourite Languages: </strong><font>Javascript, Typescript, Python</font>

                        <div style={{ marginTop: '20px' }}>
                            I started programming and making web apps at my 6th grade with python then learnt nodejs and typescript then slowly started learning web frameworks such as reactjs, nextjs and then programming languages such as chsarp, c, etc!<br/><br/>
                            I personally love making web apps! For this reason i have made my own development named <strong>Decimal Development</strong>! I am not a true gamer but i still play games like Among us and make games. I rarely make softwares and mobile apps.

                            <br/><br/>
                            <strong>Warning: </strong> My name is not Scientific Guy in real life too. It's just my internet username!
                        </div>
                    </div>
                </div>
            </Section>

            <Section number="02" name="What do i know?" className="ik">
                {['javascript', 'typescript', 'html5', 'css3', 'python', 'react', 'vuejs', 'csharp', 'express', 'flask', 'bash', 'mongodb', 'electron'].map(x => {
                    return <img src={`https://raw.githubusercontent.com/devicons/devicon/master/icons/${x}/${x}-original.svg`} alt={x}/>
                })}
            </Section>

            <Section number="03" name="My friends" className="friends">
                {['shade.png', 'abh80.gif', 'kazult.png'].map(x => {
                    let name = x.split('.')[0];

                    return <div className="fcover">
                        <img 
                            src={`https://cdn.decimaldev.xyz/avatars/${x}`} 
                            className="fimg" 
                            alt={name} 
                            draggable="false"
                            onClick={() => window.open(FriendLinks[name] || window.location.href)}
                        />
                        <font className="name">{name}</font>
                    </div>
                })}
            </Section>

            <Section number="04" name="Projects" className="project-tab">
                <ProjectTab/>
            </Section>

            <Section number="05" name="Contact" className="contact-sec">
                <div className="warning">
                    I always look for ideas and inspirations to work on! If you got some, then just fill-up the form below! If any further doubts just have a chat with me on my discord server!
                </div>

                <div className="contact-box">
                    <h1>Contact</h1>
                    <font id="mistext"/>
                    
                    <input type="text" id="name-elem" placeholder="Your name here..."/><br/>
                    <input type="text" id="mail-elem" placeholder="Your mail here"/>
                    <textarea name="Message Box" id="message-elem" cols="30" rows="10" placeholder="Some message here..."></textarea>

                    <a onClick={() => {
                        const nameElement = document.getElementById('name-elem');
                        const mailElement = document.getElementById('mail-elem');
                        const messageElement = document.getElementById('message-elem');
                        const reportElement = document.getElementById('mistext');

                        if(!mailElement.value){
                            reportElement.style.color = 'tomato';
                            reportElement.innerHTML = 'No mail was provided! Atleast some kind of contact link such as website link is required in the mail box!';
                            return;
                        }

                        if(!messageElement.value){
                            reportElement.style.color = 'tomato';
                            reportElement.innerHTML = 'No message was provided to send!';
                            return;
                        }
                        
                        let name = nameElement.value || 'Random User';
                        let mail = mailElement.value;
                        let message = messageElement.value;

                        const error = () => {
                            reportElement.style.color = 'tomato';
                            reportElement.innerHTML = 'Request failed!';
                        }

                        fetch('https://api.decimaldev.xyz/v3/contact', {
                            method: 'POST',
                            headers: { name, mail, message: encodeURIComponent(message) }
                        }).then(res => res.json(), error).then(data => {
                            if(data.message !== 'OK') return error();

                            reportElement.style.color = 'var(--cyan)';
                            reportElement.innerHTML = 'Sent message! We will be reviewing and sending a mail or request!';
                        }, error)
                    }} className="send-message">Send</a>
                </div>
            </Section>
        </div>

        <Footer/>
    </>

};