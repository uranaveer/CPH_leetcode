#include <bits/stdc++.h>
using namespace std;
using ll = long long;
#define mod 1000000007

int expandAroundCenter(string s, int left, int right) {
        while (left >= 0 && right < s.length() && s[left] == s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
}    
string longestPalindrome(string s) {
        if (s.empty()) {
            return "";
        }

        int start = 0;
        int end = 0;

        for (int i = 0; i < s.length(); i++) {
            int odd = expandAroundCenter(s, i, i);
            int even = expandAroundCenter(s, i, i + 1);
            int max_len = max(odd, even);

            if (max_len > end - start) {
                start = i - (max_len - 1) / 2;
                end = i + max_len / 2;
            }
        }

        return s.substr(start, end - start + 1);        
    }

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0); cout.tie(0); 
     

    string s;
    cin>>s;

    cout<<longestPalindrome(s)<<' ';

    return 0; 
}
