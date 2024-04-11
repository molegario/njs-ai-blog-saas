import { faCentSign, faHashtag, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Logo() {

  return <div className="text-1xl text-center py-4 font-heading">
    (The)CommonNonsense
    <div className="text-sm text-yellow-500 inline-block ml-2">
      <FontAwesomeIcon icon={faHashtag}/>
      <FontAwesomeIcon icon={faQuestion}/>
      <FontAwesomeIcon icon={faCentSign}/>
    </div>
  </div>
}