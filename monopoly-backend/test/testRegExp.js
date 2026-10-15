const text = "random(1000,2000)";

// 推荐正则：
// ^(\w+)      : 捕获函数名 (第1组)
// \s*         : 允许函数名和括号间有空格
// $          : 匹配左括号
// \s*(-?\d+(?:\.\d+)?) : 捕获第一个参数，支持负数和小数 (第2组)
// \s*,\s*     : 匹配逗号及周围可能的空格
// \s*(-?\d+(?:\.\d+)?) : 捕获第二个参数，支持负数和小数 (第3组)
// \s*$       : 匹配右括号
// $           : 字符串结尾
const regex = /^(\-|\+)?(\w+)\((\d+)\,(\d+)\)$/;

const match = text.match(regex);

if (match) {
    console.log("✅ 匹配成功");
    console.log("符号:", match[1]); // random
    console.log("函数名:", match[2]); // random
    console.log("参数1:", match[3]);  // 1000
    console.log("参数2:", match[4]);  // 2000
} else {
    console.log("❌ 匹配失败");
    // 调试技巧：打印原始字符串的 repr 形式，查看是否有隐藏字符
    console.log("原始内容检查:", JSON.stringify(text));
}
