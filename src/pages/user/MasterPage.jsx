import React from 'react'
import Home from './Home'
import Projects from './Projects'
import Services from './Services'
import About from './About'
import ChatbotWidget from './ChatbotWidget'

const MasterPage = () => {
    return (
        <div>
            <Home />
            <Projects />
            <Services />
            <About />
            <ChatbotWidget />

        </div>
    )
}

export default MasterPage
