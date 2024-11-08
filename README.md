BioGuard: Water Hyacinth Monitoring and Prevention Dashboard

Welcome to the BioGuard Dashboard repository! This project is part of our mission to monitor and control the growth of invasive water hyacinth, which poses serious environmental challenges. Our team is using technology to offer sustainable solutions to mitigate the spread of this plant, focusing on real-time data collection and visualization.

Project Overview

BioGuard is a data-driven platform designed to monitor and prevent the spread of water hyacinth by providing insights on growth patterns and environmental impacts. We developed this dashboard to support environmental scientists and communities in decision-making by delivering actionable insights into the water hyacinth growth data. This repository contains all code and configuration needed to run the dashboard.

Key Features

	•	Real-Time Monitoring: Displays live updates on water hyacinth growth metrics using data from IoT sensors connected via The Things Network (TTN).
	•	Data Management: Powered by a Supabase backend, ensuring secure and scalable data storage.
	•	LoRaWAN Integration: Leverages LoRaWAN for long-range, low-power data transmission from remote water hyacinth monitoring locations.
	•	Interactive Dashboard: User-friendly interface to view, analyze, and export data in various formats for comprehensive analysis.

Tech Stack

	•	Frontend: React.js
	•	Backend: Supabase
	•	IoT Network: LoRaWAN, The Things Network
	•	Data Source: IoT sensors tracking environmental factors related to water hyacinth growth

How It Works

	1.	Data Collection: IoT sensors installed in affected areas monitor environmental parameters.
	2.	Data Transmission: Collected data is sent through LoRaWAN to The Things Network, where it is received and processed.
	3.	Data Storage: The data is stored in a Supabase database for easy access and management.
	4.	Dashboard Visualization: Our dashboard fetches and visualizes data, providing insights to help control water hyacinth growth.

Getting Started

To run the dashboard locally, clone this repository and follow these steps:
	1.	Install Dependencies:

npm install


	2.	Environment Setup: Configure environment variables for Supabase and The Things Network.
	3.	Run Application:

npm run dev



Contributions

We welcome contributions to improve the BioGuard dashboard! Please feel free to fork this repository, create a branch, and submit a pull request.

License

This project is licensed under the MIT License.

The BioGuard team is committed to advancing the sustainable management of invasive species. Let’s work together to create impactful environmental solutions!