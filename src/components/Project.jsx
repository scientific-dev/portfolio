import React from 'react';
import proptypes from 'prop-types';

const ButtonType = proptypes.exact({
    name: proptypes.string.isRequired,
    href: proptypes.string.isRequired,
    svg: proptypes.string.isRequired
});

const ProjectType = proptypes.exact({
    name: proptypes.string.isRequired,
    description: proptypes.string.isRequired,
    link: proptypes.string.isRequired,
    languages: proptypes.arrayOf(proptypes.string).isRequired,
    buttons: proptypes.arrayOf(ButtonType).isRequired
})

function BreakButton({ button }){
    return <a href={button.href}><i className={button.svg}/></a>
}

function Project({ project }){

    return <div className="project-card">
        <div className="svg-row">
            <i className="far fa-folder-open fa-2x"/>
            <span style={{ float: 'right' }}>
                <a href={project.link}><i className="fas fa-external-link-alt"/></a>
                {project.buttons.map(x => BreakButton({ button: x }))}
            </span>
        </div>

        <h2>{project.name}</h2>
        <p>{project.description}</p>

        {project.languages.map(x => <font>{x}</font>)}
    </div>

};

BreakButton.propTypes = { 
    button: ButtonType
};

Project.propTypes = {
    project: ProjectType
}

export default Project;