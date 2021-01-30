/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Project from './Project';

export default function ProjectTab(){

    const [projects, setProjects] = React.useState(window.projects.slice(0, 6));

    return <div style={{ textAlign: 'center' }}>
        <div className="row" style={{ textAlign: 'left' }}>
            {projects.map(x => <Project project={x}/>)}
        </div>
        <div>
            <a onClick={() => {
                const collapseElement = document.getElementById('collapse-btn');

                if(collapseElement.innerHTML === 'View all projects?'){
                    setProjects(window.projects);
                    collapseElement.innerHTML = 'Collapse?';
                }else{
                    setProjects(window.projects.slice(0, 6));
                    collapseElement.innerHTML = 'View all projects?';
                }
            }} style={{
                color: '#7298da',
                display: 'inline-block',
                marginTop: '20px',
                cursor: 'pointer',
                fontSize: '20px'
            }} id="collapse-btn">View all projects?</a>
        </div>
    </div>

}