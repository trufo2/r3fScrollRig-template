export const scrolRigHtml = {
  titles: [
    'natureofcode.com',
    'deepseek.com', 
    'wikipedia.org',
    '3JS dynamic lights'
  ],
  descriptions: [
    'Particle systems explained',
    'Reasoning AI: All your bases will belong to me... Soonish',
    'ThreeJS: A JavaScript library used to display animated 3D in a web browser',
    'github project: drag the lights or modify them with double-click'
  ],
  url: [
    'https://natureofcode.com/particles/',
    'https://chat.deepseek.com/',
    'https://en.wikipedia.org/wiki/Three.js',
    'https://trufo2.github.io/threejs_interactive_lights_bs14/'
  ],
  fileName: [
    './assets/textures/natureofcode_com.jpg',
    './assets/textures/deepSik.jpg',
    './assets/textures/wikipedia_org-three.jpg',
    './assets/textures/threejsDynamicLights.jpg'
  ]
};

export default function ScrolRigHtmlComponent({ title, description, url, isFirst }){
  return (
    <article className={`html-text ${isFirst ? 'html-text-first' : ''}`}>
      <h3 className="html-title">
        <span className="html-txtSpanTop">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </span>
      </h3>
      <h4 className="html-description">
        <span className="html-txtSpanBtm">
          {description}
        </span>
      </h4>
    </article>
  )
}
