import * as React from "react";
import { useState, useRef, useEffect } from "react";

const rspCoords = {
  바위: "0",
  가위: "-142px",
  보: "-284px"
} as const; //값을 변경 못하도록 고정(readonly)

const scores = {
  가위: 1,
  바위: 0,
  보: -1
} as const;

//* typeof *
// 예시 : type example = typeof rspCoords
type ImgCoords = typeof rspCoords[keyof typeof rspCoords];

const computerChoice = (imgCoords: ImgCoords) => {
  // * as *
  // Object.keys 는 string[]이므로 우리가 원하는 배열로 변환하기 위해 as 사용
  // as를통해 Object.keys를 형 변환
  // var jsh = 1 || "hi"
  // var aa = jsh as string
  const keysArr = Object.keys(rspCoords) as ["바위", "가위", "보"];
  return (Object.keys(rspCoords) as ["바위", "가위", "보"]).find(k => {
    return rspCoords[k] === imgCoords;
  })!; // 느낌표를 통해 undefiend가 나올 수 없음을 보장
};

const RSP = () => {
  const [result, setResult] = useState("");

  //타입 추론이 잘되도록 usestate에 제너릭 작성
  const [imgCoord, setImgCoord] = useState<ImgCoords>(rspCoords.바위);
  const [score, setScore] = useState(0);
  const interval = useRef<number>();

  useEffect(() => {
    // componentDidMount, componentDidUpdate 역할(1대1 대응은 아님)
    console.log("다시 실행");

    // window. 을 붙여주는 이유는 타입스크립트가 setInterval이 노드에서 실행되는지 윈도우에서 실행되는지
    // 모르기떄문에 명시적으로 window.setInterval 임을 지정하기 위함이다.
    interval.current = window.setInterval(changeHand, 100);
    return () => {
      // componentWillUnmount 역할
      console.log("종료");
      clearInterval(interval.current);
    };
  }, [imgCoord]);

  const changeHand = () => {
    if (imgCoord === rspCoords.바위) {
      setImgCoord(rspCoords.가위);
    } else if (imgCoord === rspCoords.가위) {
      setImgCoord(rspCoords.보);
    } else if (imgCoord === rspCoords.보) {
      setImgCoord(rspCoords.바위);
    }
  };

  const onClickBtn = (choice: keyof typeof rspCoords) => () => {
    clearInterval(interval.current);
    const myScore = scores[choice];
    const cpuScore = scores[computerChoice(imgCoord)];
    const diff = myScore - cpuScore;
    if (diff === 0) {
      setResult("비겼습니다!");
    } else if ([-1, 2].includes(diff)) {
      setResult("이겼습니다!");
      setScore(prevScore => prevScore + 1);
    } else {
      setResult("졌습니다!");
      setScore(prevScore => prevScore - 1);
    }
    setTimeout(() => {
      interval.current = window.setInterval(changeHand, 100);
    }, 1000);
  };

  return (
    <>
      <div
        id="computer"
        style={{
          background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0`
        }}
      />
      <div>
        <button id="rock" className="btn" onClick={onClickBtn("바위")}>
          바위
        </button>
        <button id="scissor" className="btn" onClick={onClickBtn("가위")}>
          가위
        </button>
        <button id="paper" className="btn" onClick={onClickBtn("보")}>
          보
        </button>
      </div>
      <div>{result}</div>
      <div>현재 {score}점</div>
    </>
  );
};

export default RSP;
