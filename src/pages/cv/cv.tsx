const candidate = {
  name: 'Nguyen Duc Manh',
  title: 'Software engineer',
  details: {
    title: 'Software Engineer',
    address: 'Imperia Garden, Nguyen Huy Tuong Street, Thanh Xuan, Hanoi',
    dob: '09 Feb 1993',
    email: 'manhnd9293@gmail.com',
    phone: '0911.148.568',
  },
  summary: 'I’m an experienced developer with 4 years of experience working in domains: ecommerce, business management. I’m specialized in NodeJS and Javascript technologies and always try to deliver high quality source code which is maintainable, reliable and have high performance.',
  careerExperience: [
    {
      company: 'Uptempo Vietnam',
      title: 'Software engineer',
      from: 'May 2023',
      to: 'Current',
      responsibility: [
        'Joining engineer team to develop software system for Korean clients',
        'Collaborate with BA and Design Team in Korean to clarify software requirements',
        'Design feature flow, API endpoints and implement, test and fix them if any',
        'Review code for other team members',
        'Setup infrastructure in Google Cloud and AWS to deploy services to environments (development, staging, production)',
        'Setup CI/CD pipeline for projects to automate deploy process.',
        'Using Technology: NestJS, ReactJS, AWS, Google Cloud, Terraform, Docker, MySQL, Redis'
      ]
    },
    {
      company: 'Advesa Digital Solution',
      title: 'Backend Software engineer',
      from: 'Jan 2022',
      to: 'Feb 2023',
      responsibility: [
        'Joining in production team of company to develop a chat application for customer care agents of ecommerce companies to support online customers',
        'Collaborating with Business Analysis, Design and Engineer teams in Canada to clarify software requirements',
        'Design technical solutions and implement, test, and fix them',
        'Review code for other team members',
        'Using technologies: NodeJs, Mongodb, Redis, SocketIO, Docker',
      ]
    },
    {
      company: 'Rabiloo Software Company',
      title: 'Software engineer',
      from: 'Jan 2020',
      to: 'Jan 2022',
      responsibility: [
        'Participate in projects to build enterprise systems on web for Japanese Client.',
        'Main responsibilities: develop features, fix bugs, unit test, integration test',
        'Using Technology: NodeJS, Spring Boot, Vuejs, MySQL, AWS',
      ]
    }
  ],
  projects: [
    {
      name: 'Customer support Chat System',
      description: 'This system is for customer care agents of ecommerce companies communicating with customers when they are visiting online stores. The system is designed as micro services with REST API, web socket service, and worker nodes. Some main features that I developed are:',
      features: [
        'Creating API endpoint for managing information about customer care agents, stores, support categories, …',
        'Develop real time dashboard to show statistic data about conversation, rating, chat duration, …',
        'Integrate with Stripe platform to purchase subscription plans, additional seats and capacity in the system.',
        'Limit features which users can use based on their subscription plan and purchased capacity.',
        'Link and synchronize store data between CRM system and chat system',
        'Auto assign agent to conversation, tracking customer idle state and auto response',
        'Setup codebase for REST API service and worker nodes.',
      ],
      technology: {
        backend: 'Nodejs, Python, Fastify, SocketIO',
        database: 'Mongodb, Redis',
        infrastructure: 'Google Kubernetes Engine'
      }
    },
    {
      name: 'Construction Supervision System',
      description: 'The system is used to support construction supervision work by using web technologies, computer files and online meeting to substitute for paper and on-site supervising activities. Some main features that I developed are:',
      features: [
        'Design database schema and create API endpoints for managing entities in the system such as: users, construction site, drawing, supervision area, inspection checklist, inspection category, online meeting, project documents',
        'Creating supervision plans with drawing, inspection position, inspection category, inspection status',
        'Upload and download drawings, site images, videos',
        'Integrate with Amazon Chime SDK to create online video meeting to perform online supervision. Real time update documents and status of the meeting to all participants',
        'Storing construction documents under folder tree structure. Supporting copy, paste, cut, rename actions with files and folders',
        'Setup infrastructure in AWS to deploy the system'
      ],
      technology: {
        backend: 'NestJS, Prisma, SocketIO',
        database: 'PosgreSQL, Redis',
        infrastructure: 'AWS EC2, Load Balance, CloudFront, S3, Route 53, Chime SDK, Github Action'
      }
    },

    {
      name: 'Resource Management System',
      description: 'The system is used to manage freelancers’ information and their projects from many countries in the world. My responsibilities are:',
      features: [
        'Design database schema entities in the system including business units, freelancers, projects, invoices ...',
        'Develop features to query and update information of entities in the system (create, update, filter, paging, delete, restore data)',
        'Integrate with Google Authentication API for feature login using Google account',
        'Check users’ authorization based on their roles',
        'Tracking changes in freelancer profile data and show these change logs when needed',
        'Setup infrastructure for develop, staging, production environments using Google Cloud Platform including: Cloud Run, Load balance, Cloud Build, Google SQL, Google Compute Engine, Google Artifact Registry',
        'Set up CI/CD pipeline using CloudBuild to automatically deploy the system to environments'
      ],
      technology: {
        backend: 'NestJs, Apollo Server, TypeORM',
        database: 'PosgreSQL, Redis',
        infrastructure: 'Docker, Google Cloud Platform, Github Action, Terraform'
      }
    },
    {
      name: 'Cross-border Project Management System',
      description: 'The system is used to manage work in IT projects which is similar to Jira. It also supports chatting between members in projects and translate messages from any languages to users’ language. I worked as a fullstack developer in this projects. Some features I developed are:',
      features: [
        'Create, update, delete, restore projects feature',
        'Invite members into project via emails',
        'Create update, delete project tickets including information about: category, name, due date, priority, state , attachments, description, comments',
        'Uploading, deleting image and pdf documents to and from a project',
        'Chat feature between member in projects, translate original messages to language set by current user',
        'Translate documents and sharing between members'
      ],
      technology: {
        backend: 'NestJs, TypeORM',
        database: 'MySQL',
        infrastructure: 'NginX, Docker, EC2'
      }
    },
    {
      name: 'HR information management system',
      description: 'The system is developed for HR department to manage work shift of workers. Some main functions include:',
      features: [
        'Manage employee information about: personal data, contract, departments, timekeeping',
        'Calculate number of working days in month for employees from timekeeping machine and daily records and send mail results to them',
        'Display and export statistic information on request from HR manager'
      ],
      technology: {
        backend: 'Spring boot',
        database: 'MySQL',
        infrastructure: 'NginX, Docker, EC2'
      }
    }
  ],
  education: [
    {
      school: 'Hanoi University of Science and Technology',
      from: 'May 2018',
      to: 'July 2020',
      degree: 'Engineer in Information Technology, Fulltime, GPA: 3.23 /4',
    },
    {
      school: 'Foreign Trade University',
      from: 'Sept 2011',
      to: 'May 2015',
      degree: 'Bsc in Banking & International Finance, Fulltime, GPA: 3.24 /4',
    }
  ],
  certificates: [
    'IELTS 7.0 (Listening 7.0, Reading 8.0, Speaking 6.0, Writing 6.5) – IDP Vietnam',
    'Machine Learning by Professor Andrew Ng –  Coursera & Stanford University',
    'MongoDB data modeling course – MongoDB university: Credential',
    'Problem Solving (intermediate) - Hackerank – Credential'
  ]


}

function Cv() {

  return (
    <div className={'text-[14px] ml-4'}>
      <div className={'text-2xl font-semibold'}>{candidate.name}</div>
      <div>{candidate.title}</div>

      <div className={'mt-2'}>
        <div className={'font-semibold text-lg '}>Details</div>
        <div className={'grid grid-cols-12'}>
          <div className={'col-span-1'}>Address</div>
          <div className={'col-span-11'}>{candidate.details.address}</div>

          <div className={'col-span-1'}>DOB</div>
          <div className={'col-span-11'}>{candidate.details.dob}</div>

          <div className={'col-span-1'}>Email</div>
          <div className={'col-span-11'}>{candidate.details.email}</div>

          <div className={'col-span-1'}>Mobile</div>
          <div className={'col-span-11'}>{candidate.details.phone}</div>
        </div>

      </div>
      <div className={'font-semibold text-lg mt-2 '}>Summary</div>
      <div>
        {candidate.summary}
      </div>

      <div className={'mt-2'}>
        <div className={'font-semibold text-lg '}>Career Experiences</div>
        <div className={'mt-1'}>
          {
            candidate.careerExperience.map((exp, idx) => (
              <div key={idx} className={'mt-1'}>
                <div className={'font-semibold'}>{exp.company} - {exp.title}</div>
                <div>{exp.from} - {exp.to}</div>
                <ul className={'mt-1 list-disc ml-8'}>
                  {exp.responsibility.map((res, idx) => (
                    <li key={idx}>{res}</li>
                  ))}
                </ul>
              </div>
            ))
          }
        </div>
      </div>

      <div className={'mt-2'}>
        <div className={'font-semibold text-lg '}>Projects</div>
        <div>
          {
            candidate.projects.map((p, index) => (
              <div key={index} className={'mt-2'}>
                <div className={'font-semibold'}>{p.name}</div>
                <div>{p.description}</div>
                <ul className={'mt-1 list-disc ml-8'}>
                  {
                    p.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))
                  }
                </ul>
                <div className={'mt-1'}>Technology used:</div>
                <ul className={'list-disc ml-8'}>
                  {p.technology?.backend && <li>Backend: {p.technology.backend}</li>}
                  {p.technology?.database && <li>Database: {p.technology.database}</li>}
                  {p.technology?.infrastructure && <li>Infrastructure: {p.technology.infrastructure}</li>}
                </ul>
              </div>
            ))
          }
        </div>
      </div>

      <div className={'mt-2'}>
        <div className={'text-lg font-semibold '}>Educations</div>
        <div>
          {
            candidate.education.map((edu, idx) => (
              <div key={idx} className={'mt-1'}>
                <div className={'font-semibold'}>{edu.school}</div>
                <div className={'italic'}>{edu.from} - {edu.to}</div>
                <div>{edu.degree}</div>
              </div>
            ))
          }
        </div>
      </div>

      <div className={'mt-2'}>
        <div className={'font-semibold text-lg '}>Certificates</div>
        <ul className={'list-disc ml-8 mt-1'}>
          {
            candidate.certificates.map((c, i) => (
              <li key={i}>{c}</li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default Cv;