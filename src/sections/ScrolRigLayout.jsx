import { scrolRigHtml } from "./ScrolRigHtml";
import ScrolRigHtmlComponent from "./ScrolRigHtml";
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
            isFirst={index === 0}
          />
          <ScrolRigThreeComponent 
            texturePath={scrolRigHtml.fileName[index]}
            isFirst={index === 0}
          />
        </div>
      ))}
    </div>
  )
}
