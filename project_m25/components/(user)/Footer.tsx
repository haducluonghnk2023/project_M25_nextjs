import React from "react";
import { FaFacebookF, FaVimeoV } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io5";
import { GrInstagram } from "react-icons/gr";
import Image from "next/image";
const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex space-x-6 mb-4">
            <FaFacebookF />
            <GrInstagram />
            <IoLogoYoutube />
            <FaVimeoV />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <h5 className="font-bold">ORDERS</h5>
              <ul>
                <li>Order Status</li>
                <li>Payment & Shipping</li>
                <li>Returns</li>
                <li>Warranty</li>
                <li>Terms and Conditions</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold">SUPPORT</h5>
              <ul>
                <li>Support Center</li>
                <li>Submit Request</li>
                <li>Product Registration</li>
                <li>Predator Rewards</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold">INNOVATION</h5>
              <ul>
                <li>Best Pool Cues</li>
                <li>25 Years of Innovation</li>
                <li>Why is Cue Deflection Better?</li>
                <li>Sizes for Your Room</li>
                <li>Making the Best Pool Tables</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold">COMMUNITY</h5>
              <ul>
                <li>Sponsored Events</li>
                <li>Official Pro Billiard Series Equipment</li>
                <li>Equipment Talk</li>
                <li>Sponsorship Requests</li>
                <li>News & Guide Articles</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/m25-project-e7165.appspot.com/o/images%2FPredator-SF-footer-logo-compressor.png?alt=media&token=ba2234bf-b9dc-4cf2-8554-9707041cf2e0"
              alt="loi"
              width={100}
              height={100}
            ></Image>
            <div>
              <p>Phone: 1-888-314-4111</p>
              <p>Contact Us</p>
            </div>
          </div>

          <div>
            <p>
              © 2024 Predator Products. All Rights Reserved. Predator, Poison
              and Uni-Loc are registered trademarks of Predator Group.
            </p>
          </div>

          <div className="flex space-x-4">
            <span>Newsletter Signup</span>
            <span>|</span>
            <span>Become a Dealer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
