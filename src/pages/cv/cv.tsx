import { candidate } from '@/pages/cv/candidate-data.ts';
import { BikeIcon, ScrollTextIcon } from 'lucide-react';

function Cv() {

  return (
    <div className={'text-[14px] ml-4'}>
      <div className={'text-2xl font-semibold'}>{candidate.name}</div>
      <div>{candidate.title}</div>

      <div className={'mt-3'}>
        <div className={'font-semibold text-lg flex gap-2 items-center'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path fill-rule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clip-rule="evenodd"/>
          </svg>
          <span>Details</span>
        </div>
        <div className={'flex gap-2 ml-3'}>
          <div>
            <div className={'col-span-1'}>Home address</div>
            <div className={'col-span-1'}>Date of birth</div>
            <div className={'col-span-1'}>Email</div>
            <div className={'col-span-1'}>Mobile</div>
          </div>
          <div>
            <div className={'col-span-11'}>{candidate.details.address}</div>
            <div className={'col-span-11'}>{candidate.details.dob}</div>
            <div className={'col-span-11'}>{candidate.details.email}</div>
            <div className={'col-span-11'}>{candidate.details.phone}</div>
          </div>
        </div>

      </div>
      <div className={'font-semibold text-lg mt-3 flex items-center gap-2'}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path
            d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z"/>
          <path
            d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"/>
        </svg>

        <span>Summary</span></div>
      <div className={'ml-3'}>
        {candidate.summary}
      </div>

      <div className={'mt-3'}>
        <div className={'font-semibold text-lg flex gap-2 items-center'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path fill-rule="evenodd"
                  d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clip-rule="evenodd"/>
            <path
              d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z"/>
          </svg>
          <span>Career Experiences</span>
        </div>
        <div className={'mt-1 ml-3 flex flex-col gap-1'}>
          {
            candidate.careerExperience.map((exp, idx) => (
              <div key={idx}>
                <div className={'flex gap-2'}>
                  <span className={'italic'}>{exp.from} - {exp.to}</span>
                  <span className={'font-semibold'}>{exp.company} - {exp.title}</span>
                </div>
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

      <div className={'mt-4'}>
        <div className={'font-semibold text-lg flex gap-2 items-center'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path fill-rule="evenodd"
                  d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clip-rule="evenodd"/>
          </svg>
          <span>Projects</span></div>
        <div className={'ml-3 flex flex-col gap-2'}>
          {
            candidate.projects.map((p, index) => (
              <div key={index}>
                <div className={'font-semibold italic'}>{p.name}</div>
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
        <div className={'text-lg font-semibold flex gap-2 items-center'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path
              d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z"/>
            <path
              d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z"/>
            <path
              d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z"/>
          </svg>
          <span>Educations</span></div>
        <div className={'ml-3'}>
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
        <div className={'font-semibold text-lg flex items-center gap-2'}>
          <ScrollTextIcon className={'size-5'}/>
          <span>Certificates</span></div>
        <ul className={'list-disc ml-8'}>
          {
            candidate.certificates.map((c, i) => (
              <li key={i}>
                <span>{c.name}</span>
                {c.link && 
                  (<span> - <a className={'text-blue-700 underline'} href={c.link}>Credential</a></span>)
                }
              </li>
            ))
          }
        </ul>
      </div>
      <div className={'mt-2'}>
        <div className={'font-semibold text-lg flex items-center gap-2'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path
              d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z"/>
          </svg>

          <span>Other skills</span></div>
        <ul className={'list-disc ml-8'}>
          {
            candidate.otherSkills.map((c, i) => (
              <li key={i}>{c}</li>
            ))
          }
        </ul>
      </div>
      <div className={'mt-2'}>
        <div className={'font-semibold text-lg flex items-center gap-2'}>
          <BikeIcon className={'size-5'}/>
          <span>Hobbies</span></div>
        <ul className={'list-disc ml-8'}>
          {
            candidate.hobbies.map((c, i) => (
              <li key={i}>{c}</li>
            ))
          }
        </ul>
      </div>
      <div className={'mt-2'}>
        <div className={'font-semibold text-lg flex items-center gap-2'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path fill-rule="evenodd"
                  d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5Zm6.61 10.936a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 14.47a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clip-rule="evenodd"/>
            <path
              d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"/>
          </svg>

          <span>References</span></div>
        <div className={'ml-8'}>
          Available on request
        </div>
      </div>
    </div>
  );
}

export default Cv;