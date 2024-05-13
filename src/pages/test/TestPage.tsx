import PageTitle from '@/pages/common/PageTitle.tsx';
import EditorComponent from '@/pages/test/editor/EditorComponent.tsx';
import { useState } from 'react';
import DOMPurify from 'dompurify';

function TestPage() {
  const [textContent, setTextContent] = useState('');
  return (
    <div>
      <PageTitle>Test Page</PageTitle>
      <div className={'mt-8'}>
        <EditorComponent content={textContent}
                         onUpdateContent={setTextContent}/>
      </div>
      <div className={'mt-8'}>
        <div className={'text-xl'}>Content render</div>
        <div>
          <div className={'prose prose-a:text-blue-600 max-w-none'} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(textContent)}}></div>
        </div>
      </div>
    </div>

  );
}

export default TestPage;