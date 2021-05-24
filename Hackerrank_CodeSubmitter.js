const puppeteer=require("puppeteer");
let { answers } = require("./codes");
let currentPage;

(async function fn(){
    // launch opens the browser and return an instance of browser
    let browserOpenPromise=puppeteer.launch({
    headless:false,
    // by default viewport is set to 800*600 but now we have set it to null
    defaultViewport:null,
    // this will set the viewport as maximum available for the screen
    args:["--start-maximized"]
}) 

    let browser=await browserOpenPromise;
     // pages() fxn promise to return all the tabs opened in the browser in an array
    let allTabsArray=await browser.pages();
    currentPage=allTabsArray[0];
    // goto function make a request to the specified url and return the required response as a html page
    // and we are not storing the response of goto as it will be a html and we dont need it
    await currentPage.goto("https://www.hackerrank.com/auth/login");
    // type function types the specied thing in the input element specified
    // first prameter is the inputbox where we have to type
    // second is what we have to type
    // third specifies the delay we want while typing
    await currentPage.type("input[name='username']","lisinig239@mxcdd.com",{delay:200});
    await currentPage.type("input[name='password']","Ironman",{delay:200});
    // click function clicks on the button or link specified
    await currentPage.click("button[data-analytics='LoginPassword']");
    await waitAndClick(".ui-btn.ui-btn-normal.ui-btn-large.ui-btn-primary.ui-btn-link.ui-btn-styled");
    await waitAndClick("a[data-attr1='warmup']");
    await currentPage.waitForSelector(".challengecard-title",{visible:true});
    // url returns the url of current page
    let currentPageUrl=await currentPage.url();

    for(let i=0;i<answers.length;i++){
        let ansObj=answers[i];
        // we will search for the question anme and then submit the code of that question only
        await questionSolver(ansObj.qName,ansObj.soln,currentPageUrl);
    }
})()

async function waitAndClick(selector){
    try {
        // wait for selector wait for the selector to be loaded or wait for the selector to attach on the dom tree
        await currentPage.waitForSelector(selector,{visible:true});
         // when the selector is loaded we click on it
        await currentPage.click(selector);
    } catch (err) {
        console.log(err);
        return new Error(err);
    }
}

async function questionSolver(questionName,code,currentPageUrl){
    await currentPage.goto(currentPageUrl);
    // await cTab.evaluate(consoleFn, ".challengecard-title", qName);

    // evaluate fxn helps to get elemnts from the web page
    // getallName fxn will check for the matching name of the question and then click on that question 
    await currentPage.evaluate(getallName,".challengecard-title",questionName); 
    // we are waiting for you question page to load
    await currentPage.waitForSelector("div[data-attr2='Submissions']", { visible: true });
    //clicked on custom click
    await waitAndClick(".checkbox-input");
    // waiting for the text area of custom area.
    await currentPage.waitForSelector(".custom-input.theme-old.size-medium",{visible:true});
    // typing that code in the custom input text area
    await currentPage.type(".custom-input.theme-old.size-medium",code,{delay:10});
    //now below steps are to copy the code form custom input to code editior
    await currentPage.keyboard.down("Control");
    await currentPage.keyboard.press("a");
    await currentPage.keyboard.press("x");
    await currentPage.click(".monaco-editor.no-user-select.vs");
    await currentPage.keyboard.press("a");
    await currentPage.keyboard.press("v");
    await currentPage.click(".hr-monaco-submit");
    await currentPage.keyboard.up("Control"); 
}

function getallName(selector,questionName){
    // we got the name of all the questions on the page
    let nameOfQuestions=document.querySelectorAll(selector);

    for(let i=0;i<nameOfQuestions.length;i++){
        let qname=nameOfQuestions[i].innerText.split("\n")[0];
        // we are checking the question we get from the array and on the page are same of not
        if(qname==questionName){
            // console.log(qname);
            // if they are same then we are clicking on that question.
            return nameOfQuestions[i].click();
        }
    }
}