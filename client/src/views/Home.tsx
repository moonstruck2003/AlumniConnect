import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();

    const handleLoginNav = () => navigate('/login');
    const handleSignupNav = () => navigate('/signup');

    // Animation variants
    const fadeIn: any = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    return (
        <div className="lavish-home">
            {/* Background Blobs for minimalistic gradients */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            <div className="home-content">
                <motion.div
                    className="hero-section"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={fadeIn} className="pill-badge">
                        <span className="sparkle">✨</span> Welcome to the Future of Networking
                    </motion.div>

                    <motion.h1 variants={fadeIn} className="lavish-title">
                        Connect. <span className="text-highlight">Empower.</span> Thrive.
                    </motion.h1>

                    <motion.p variants={fadeIn} className="lavish-subtitle">
                        Join a prestigious network of professionals and mentors. Experience a seamless and innovative platform tailored for your continuous growth and success.
                    </motion.p>

                    <motion.div variants={fadeIn} className="button-group">
                        <motion.button
                            className="btn-lavish btn-primary-lavish"
                            whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(16, 185, 129, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSignupNav}
                        >
                            <UserPlus size={20} className="btn-icon" />
                            Sign Up Now
                            <ArrowRight size={18} className="btn-arrow" />
                        </motion.button>

                        <motion.button
                            className="btn-lavish btn-secondary-lavish"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLoginNav}
                        >
                            <LogIn size={20} className="btn-icon" />
                            Log In
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Floating elements to add to the lavish feel */}
                <motion.div
                    className="floating-cards"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <motion.div
                        className="f-card f-card-1"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    >
                        <div className="f-icon green-icon"></div>
                        <div className="f-lines">
                            <div className="f-line short"></div>
                            <div className="f-line long"></div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="f-card f-card-2"
                        animate={{ y: [0, 20, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                    >
                        <div className="f-icon purple-icon"></div>
                        <div className="f-lines">
                            <div className="f-line long"></div>
                            <div className="f-line short"></div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
