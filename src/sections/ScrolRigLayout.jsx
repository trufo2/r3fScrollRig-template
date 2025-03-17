import { scrolRigHtml } from "./scrolRigHtml";
import ScrolRigHtmlComponent from "./scrolRigHtml";
import ScrolRigThreeComponent from "./scrolRigThree";

export default function ScrolRigLayout(){
  return (
    <div className="html-element">
      {scrolRigHtml.titles.map((title, index) => (
        <div key={index}>
          <ScrolRigHtmlComponent 
            title={title}
            description={scrolRigHtml.descriptions[index]}
            url={scrolRigHtml.url[index]}
          />
          <ScrolRigThreeComponent 
            texturePath={`./assets/textures/${scrolRigHtml.fileName[index]}`}
          />
        </div>
      ))}
    </div>
  )
}
