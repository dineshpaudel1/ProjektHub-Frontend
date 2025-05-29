import React from 'react'
import Home from './Home'
import Projects from './Projects'
import Services from './Services'
import About from './About'
// import ChatbotWidget from './ChatbotWidget'
import Testimonials from './Testimonials'

const MasterPage = () => {
    return (
        <div>
            <Home />
            <Projects />
            <Services />
            <About />
            <Testimonials />
            {/* <ChatbotWidget /> */}

        </div>
    )
}

export default MasterPage
